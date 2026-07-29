/**
 * Receipt Scanner Service
 * Uses Tesseract.js for OCR (Optical Character Recognition)
 * Extracts transaction data from receipt images
 */

import Tesseract from 'tesseract.js';

export interface ExtractedReceiptData {
  merchantName?: string;
  date?: string;
  total?: number;
  items?: Array<{
    name: string;
    quantity?: number;
    price?: number;
  }>;
  tax?: number;
  subtotal?: number;
  rawText: string;
}

export interface ScanProgress {
  status: string;
  progress: number;
}

/**
 * Scan receipt image and extract transaction data
 */
export async function scanReceipt(imageFile: File | string, onProgress?: (progress: ScanProgress) => void): Promise<ExtractedReceiptData> {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: (m: any) => {
          if (onProgress) {
            onProgress({
              status: m.status,
              progress: m.progress,
            });
          }
        },
      }
    );

    const extractedData = parseReceiptText(result.data.text);
    
    return {
      ...extractedData,
      rawText: result.data.text,
    };
  } catch (error) {
    console.error('Receipt scanning error:', error);
    throw new Error('Failed to scan receipt');
  }
}

/**
 * Parse receipt text to extract structured data
 */
function parseReceiptText(text: string): Partial<ExtractedReceiptData> {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  const data: Partial<ExtractedReceiptData> = {};
  const items: Array<{ name: string; quantity?: number; price?: number }> = [];
  
  // Common patterns for receipt parsing
  const datePatterns = [
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i,
  ];
  
  const totalPatterns = [
    /total[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
    /amount[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
    /sum[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
  ];
  
  const taxPatterns = [
    /tax[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
    /vat[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
  ];
  
  const subtotalPatterns = [
    /subtotal[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
    /sub[-\s]?total[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
  ];
  
  // Extract date
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.date = match[1];
      break;
    }
  }
  
  // Extract total
  for (const pattern of totalPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.total = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract tax
  for (const pattern of taxPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.tax = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract subtotal
  for (const pattern of subtotalPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.subtotal = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract merchant name (usually first non-date line)
  const merchantLine = lines.find(line => {
    const hasDate = datePatterns.some(pattern => pattern.test(line));
    const hasAmount = /\$[\d,]+\.?\d*/.test(line);
    return !hasDate && !hasAmount && line.length > 3;
  });
  
  if (merchantLine) {
    data.merchantName = merchantLine.trim();
  }
  
  // Extract items (lines with prices)
  const itemPattern = /^(.+?)\s+[$€£]?([\d,]+\.?\d*)$/;
  lines.forEach(line => {
    const match = line.match(itemPattern);
    if (match) {
      items.push({
        name: match[1].trim(),
        price: parseFloat(match[2].replace(/,/g, '')),
      });
    }
  });
  
  if (items.length > 0) {
    data.items = items;
  }
  
  return data;
}

/**
 * Validate extracted receipt data
 */
export function validateReceiptData(data: ExtractedReceiptData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.total || data.total <= 0) {
    errors.push('Total amount is missing or invalid');
  }
  
  if (!data.merchantName) {
    errors.push('Merchant name could not be detected');
  }
  
  if (!data.date) {
    errors.push('Date could not be detected');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create transaction from receipt data
 */
export function createTransactionFromReceipt(data: ExtractedReceiptData) {
  const validation = validateReceiptData(data);
  
  if (!validation.valid) {
    throw new Error(`Invalid receipt data: ${validation.errors.join(', ')}`);
  }
  
  return {
    amount: data.total || 0,
    description: data.merchantName || 'Receipt Purchase',
    date: data.date ? new Date(data.date) : new Date(),
    category: inferCategory(data.merchantName || ''),
    receiptUrl: '', // Will be set after image upload
    type: 'EXPENSE',
  };
}

/**
 * Infer category from merchant name
 */
function inferCategory(merchantName: string): string {
  const name = merchantName.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    'Food & Dining': ['restaurant', 'cafe', 'pizza', 'burger', 'sushi', 'bar', 'grill'],
    'Groceries': ['grocery', 'supermarket', 'market', 'walmart', 'target', 'costco'],
    'Transportation': ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'parking'],
    'Shopping': ['amazon', 'ebay', 'shop', 'store', 'mall'],
    'Entertainment': ['movie', 'theater', 'concert', 'game', 'spotify', 'netflix'],
    'Healthcare': ['pharmacy', 'drugstore', 'medical', 'hospital', 'clinic'],
    'Utilities': ['electric', 'water', 'internet', 'phone', 'utility'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}
