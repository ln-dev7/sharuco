import indentCode from '@/utils/indentCode';

function copyToClipboard(code) {
  const text = indentCode(code);
  navigator.clipboard.writeText(text);
}

export default copyToClipboard;
