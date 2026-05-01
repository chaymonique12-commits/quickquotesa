// SA phone number validation: 0xx xxx xxxx (10 digits starting with 0)
const SA_PHONE_REGEX = /^0[0-9]{9}$/;

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return SA_PHONE_REGEX.test(cleaned);
}

export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
  return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6, 10);
}

export function formatPhoneDisplay(phone: string): string {
  return formatPhone(phone.replace(/\D/g, ''));
}