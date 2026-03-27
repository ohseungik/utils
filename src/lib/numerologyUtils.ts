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

/**
 * 숫자별 의미 (간단한 설명)
 */
export interface NumberMeaning {
  number: number;
  keyword: string;
  description: string;
}

export function getNumberMeaning(num: number, type: 'lifePath' | 'expression' | 'soulUrge' | 'personality'): NumberMeaning | null {
  const meanings: { [key: number]: { [key in 'lifePath' | 'expression' | 'soulUrge' | 'personality']: NumberMeaning } } = {
    1: {
      lifePath: {
        number: 1,
        keyword: 'numerology.meanings.1.lifePath.keyword',
        description: 'numerology.meanings.1.lifePath.description',
      },
      expression: {
        number: 1,
        keyword: 'numerology.meanings.1.expression.keyword',
        description: 'numerology.meanings.1.expression.description',
      },
      soulUrge: {
        number: 1,
        keyword: 'numerology.meanings.1.soulUrge.keyword',
        description: 'numerology.meanings.1.soulUrge.description',
      },
      personality: {
        number: 1,
        keyword: 'numerology.meanings.1.personality.keyword',
        description: 'numerology.meanings.1.personality.description',
      },
    },
    2: {
      lifePath: {
        number: 2,
        keyword: 'numerology.meanings.2.lifePath.keyword',
        description: 'numerology.meanings.2.lifePath.description',
      },
      expression: {
        number: 2,
        keyword: 'numerology.meanings.2.expression.keyword',
        description: 'numerology.meanings.2.expression.description',
      },
      soulUrge: {
        number: 2,
        keyword: 'numerology.meanings.2.soulUrge.keyword',
        description: 'numerology.meanings.2.soulUrge.description',
      },
      personality: {
        number: 2,
        keyword: 'numerology.meanings.2.personality.keyword',
        description: 'numerology.meanings.2.personality.description',
      },
    },
    3: {
      lifePath: {
        number: 3,
        keyword: 'numerology.meanings.3.lifePath.keyword',
        description: 'numerology.meanings.3.lifePath.description',
      },
      expression: {
        number: 3,
        keyword: 'numerology.meanings.3.expression.keyword',
        description: 'numerology.meanings.3.expression.description',
      },
      soulUrge: {
        number: 3,
        keyword: 'numerology.meanings.3.soulUrge.keyword',
        description: 'numerology.meanings.3.soulUrge.description',
      },
      personality: {
        number: 3,
        keyword: 'numerology.meanings.3.personality.keyword',
        description: 'numerology.meanings.3.personality.description',
      },
    },
    4: {
      lifePath: {
        number: 4,
        keyword: 'numerology.meanings.4.lifePath.keyword',
        description: 'numerology.meanings.4.lifePath.description',
      },
      expression: {
        number: 4,
        keyword: 'numerology.meanings.4.expression.keyword',
        description: 'numerology.meanings.4.expression.description',
      },
      soulUrge: {
        number: 4,
        keyword: 'numerology.meanings.4.soulUrge.keyword',
        description: 'numerology.meanings.4.soulUrge.description',
      },
      personality: {
        number: 4,
        keyword: 'numerology.meanings.4.personality.keyword',
        description: 'numerology.meanings.4.personality.description',
      },
    },
    5: {
      lifePath: {
        number: 5,
        keyword: 'numerology.meanings.5.lifePath.keyword',
        description: 'numerology.meanings.5.lifePath.description',
      },
      expression: {
        number: 5,
        keyword: 'numerology.meanings.5.expression.keyword',
        description: 'numerology.meanings.5.expression.description',
      },
      soulUrge: {
        number: 5,
        keyword: 'numerology.meanings.5.soulUrge.keyword',
        description: 'numerology.meanings.5.soulUrge.description',
      },
      personality: {
        number: 5,
        keyword: 'numerology.meanings.5.personality.keyword',
        description: 'numerology.meanings.5.personality.description',
      },
    },
    6: {
      lifePath: {
        number: 6,
        keyword: 'numerology.meanings.6.lifePath.keyword',
        description: 'numerology.meanings.6.lifePath.description',
      },
      expression: {
        number: 6,
        keyword: 'numerology.meanings.6.expression.keyword',
        description: 'numerology.meanings.6.expression.description',
      },
      soulUrge: {
        number: 6,
        keyword: 'numerology.meanings.6.soulUrge.keyword',
        description: 'numerology.meanings.6.soulUrge.description',
      },
      personality: {
        number: 6,
        keyword: 'numerology.meanings.6.personality.keyword',
        description: 'numerology.meanings.6.personality.description',
      },
    },
    7: {
      lifePath: {
        number: 7,
        keyword: 'numerology.meanings.7.lifePath.keyword',
        description: 'numerology.meanings.7.lifePath.description',
      },
      expression: {
        number: 7,
        keyword: 'numerology.meanings.7.expression.keyword',
        description: 'numerology.meanings.7.expression.description',
      },
      soulUrge: {
        number: 7,
        keyword: 'numerology.meanings.7.soulUrge.keyword',
        description: 'numerology.meanings.7.soulUrge.description',
      },
      personality: {
        number: 7,
        keyword: 'numerology.meanings.7.personality.keyword',
        description: 'numerology.meanings.7.personality.description',
      },
    },
    8: {
      lifePath: {
        number: 8,
        keyword: 'numerology.meanings.8.lifePath.keyword',
        description: 'numerology.meanings.8.lifePath.description',
      },
      expression: {
        number: 8,
        keyword: 'numerology.meanings.8.expression.keyword',
        description: 'numerology.meanings.8.expression.description',
      },
      soulUrge: {
        number: 8,
        keyword: 'numerology.meanings.8.soulUrge.keyword',
        description: 'numerology.meanings.8.soulUrge.description',
      },
      personality: {
        number: 8,
        keyword: 'numerology.meanings.8.personality.keyword',
        description: 'numerology.meanings.8.personality.description',
      },
    },
    9: {
      lifePath: {
        number: 9,
        keyword: 'numerology.meanings.9.lifePath.keyword',
        description: 'numerology.meanings.9.lifePath.description',
      },
      expression: {
        number: 9,
        keyword: 'numerology.meanings.9.expression.keyword',
        description: 'numerology.meanings.9.expression.description',
      },
      soulUrge: {
        number: 9,
        keyword: 'numerology.meanings.9.soulUrge.keyword',
        description: 'numerology.meanings.9.soulUrge.description',
      },
      personality: {
        number: 9,
        keyword: 'numerology.meanings.9.personality.keyword',
        description: 'numerology.meanings.9.personality.description',
      },
    },
    11: {
      lifePath: {
        number: 11,
        keyword: 'numerology.meanings.11.lifePath.keyword',
        description: 'numerology.meanings.11.lifePath.description',
      },
      expression: {
        number: 11,
        keyword: 'numerology.meanings.11.expression.keyword',
        description: 'numerology.meanings.11.expression.description',
      },
      soulUrge: {
        number: 11,
        keyword: 'numerology.meanings.11.soulUrge.keyword',
        description: 'numerology.meanings.11.soulUrge.description',
      },
      personality: {
        number: 11,
        keyword: 'numerology.meanings.11.personality.keyword',
        description: 'numerology.meanings.11.personality.description',
      },
    },
    22: {
      lifePath: {
        number: 22,
        keyword: 'numerology.meanings.22.lifePath.keyword',
        description: 'numerology.meanings.22.lifePath.description',
      },
      expression: {
        number: 22,
        keyword: 'numerology.meanings.22.expression.keyword',
        description: 'numerology.meanings.22.expression.description',
      },
      soulUrge: {
        number: 22,
        keyword: 'numerology.meanings.22.soulUrge.keyword',
        description: 'numerology.meanings.22.soulUrge.description',
      },
      personality: {
        number: 22,
        keyword: 'numerology.meanings.22.personality.keyword',
        description: 'numerology.meanings.22.personality.description',
      },
    },
    33: {
      lifePath: {
        number: 33,
        keyword: 'numerology.meanings.33.lifePath.keyword',
        description: 'numerology.meanings.33.lifePath.description',
      },
      expression: {
        number: 33,
        keyword: 'numerology.meanings.33.expression.keyword',
        description: 'numerology.meanings.33.expression.description',
      },
      soulUrge: {
        number: 33,
        keyword: 'numerology.meanings.33.soulUrge.keyword',
        description: 'numerology.meanings.33.soulUrge.description',
      },
      personality: {
        number: 33,
        keyword: 'numerology.meanings.33.personality.keyword',
        description: 'numerology.meanings.33.personality.description',
      },
    },
  };

  return meanings[num]?.[type] || null;
}
