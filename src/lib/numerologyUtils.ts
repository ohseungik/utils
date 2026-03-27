/**
 * 수비학(Numerology) 계산 유틸리티 함수
 */

// 알파벳에 대응하는 수비학 숫자
const NUMEROLOGY_MAP: { [key: string]: number } = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

// 모음
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

/**
 * 숫자를 단일 자릿수로 축소 (마스터 넘버 11, 22, 33 제외)
 */
export function reduceToSingleDigit(num: number): number {
  // 마스터 넘버는 축소하지 않음
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }

  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    
    // 축소 과정에서 마스터 넘버가 나오면 중단
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
  }

  return num;
}

/**
 * 생명수(Life Path Number) 계산 - 생년월일 기반
 */
export function calculateLifePathNumber(birthdate: string): number | null {
  try {
    const date = new Date(birthdate);
    if (isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 연, 월, 일을 각각 단일 자릿수로 축소
    const reducedYear = reduceToSingleDigit(year);
    const reducedMonth = reduceToSingleDigit(month);
    const reducedDay = reduceToSingleDigit(day);

    // 세 숫자를 더해서 최종 생명수 계산
    return reduceToSingleDigit(reducedYear + reducedMonth + reducedDay);
  } catch (error) {
    return null;
  }
}

/**
 * 문자열의 숫자 값 계산
 */
function calculateNameValue(name: string, vowelsOnly = false): number {
  const upperName = name.toUpperCase();
  let sum = 0;

  for (const char of upperName) {
    if (NUMEROLOGY_MAP[char] !== undefined) {
      // 모음만 계산하는 경우
      if (vowelsOnly) {
        if (VOWELS.includes(char)) {
          sum += NUMEROLOGY_MAP[char];
        }
      } else {
        sum += NUMEROLOGY_MAP[char];
      }
    }
  }

  return sum;
}

/**
 * 표현수(Expression Number) 계산 - 전체 이름 기반
 */
export function calculateExpressionNumber(fullName: string): number | null {
  try {
    if (!fullName.trim()) {
      return null;
    }

    // 공백 제거하고 알파벳만 사용
    const cleanName = fullName.replace(/[^a-zA-Z]/g, '');
    
    if (cleanName.length === 0) {
      return null;
    }

    const sum = calculateNameValue(cleanName, false);
    return reduceToSingleDigit(sum);
  } catch (error) {
    return null;
  }
}

/**
 * 영혼충동수(Soul Urge Number) 계산 - 이름의 모음만 기반
 */
export function calculateSoulUrgeNumber(fullName: string): number | null {
  try {
    if (!fullName.trim()) {
      return null;
    }

    // 공백 제거하고 알파벳만 사용
    const cleanName = fullName.replace(/[^a-zA-Z]/g, '');
    
    if (cleanName.length === 0) {
      return null;
    }

    const sum = calculateNameValue(cleanName, true);
    return reduceToSingleDigit(sum);
  } catch (error) {
    return null;
  }
}

/**
 * 성격수(Personality Number) 계산 - 이름의 자음만 기반
 */
export function calculatePersonalityNumber(fullName: string): number | null {
  try {
    if (!fullName.trim()) {
      return null;
    }

    const upperName = fullName.toUpperCase().replace(/[^a-zA-Z]/g, '');
    
    if (upperName.length === 0) {
      return null;
    }

    let sum = 0;
    for (const char of upperName) {
      if (NUMEROLOGY_MAP[char] !== undefined && !VOWELS.includes(char)) {
        sum += NUMEROLOGY_MAP[char];
      }
    }

    return reduceToSingleDigit(sum);
  } catch (error) {
    return null;
  }
}
