/**
 * UUID 생성 및 관련 유틸리티 함수들
 */

/**
 * UUID v4 생성
 */
export function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  
  // Fallback: Manual UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 여러 개의 UUID 생성
 */
export function generateMultipleUUIDs(count: number): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUID());
  }
  return uuids;
}

/**
 * UUID 대문자로 변환
 */
export function toUpperCase(uuid: string): string {
  return uuid.toUpperCase();
}

/**
 * UUID 소문자로 변환
 */
export function toLowerCase(uuid: string): string {
  return uuid.toLowerCase();
}

/**
 * UUID에서 하이픈 제거
 */
export function removeHyphens(uuid: string): string {
  return uuid.replace(/-/g, '');
}

/**
 * UUID에 하이픈 추가 (하이픈이 없는 경우)
 */
export function addHyphens(uuid: string): string {
  if (uuid.includes('-')) return uuid;
  
  // 표준 UUID 형식: 8-4-4-4-12
  return uuid.replace(
    /^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/i,
    '$1-$2-$3-$4-$5'
  );
}

/**
 * UUID 유효성 검증
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const uuidWithoutHyphensRegex = /^[0-9a-f]{32}$/i;
  
  return uuidRegex.test(uuid) || uuidWithoutHyphensRegex.test(uuid);
}

/**
 * UUID 포맷 적용 (대소문자, 하이픈)
 */
export function formatUUID(
  uuid: string,
  options: {
    uppercase?: boolean;
    hyphens?: boolean;
  }
): string {
  let formatted = uuid;
  
  // 하이픈 처리
  if (options.hyphens === false) {
    formatted = removeHyphens(formatted);
  } else if (options.hyphens === true) {
    formatted = addHyphens(formatted);
  }
  
  // 대소문자 처리
  if (options.uppercase === true) {
    formatted = toUpperCase(formatted);
  } else if (options.uppercase === false) {
    formatted = toLowerCase(formatted);
  }
  
  return formatted;
}
