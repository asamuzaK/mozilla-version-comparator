'use strict';

/*
 * return the indexOf the first occurrence of one of char in chars within string.
 * see c++ strpbrk function.
 */
const strpbrk = function(string, chars) {
  for (let i = 0; i < string.length; i++) {
    const index = chars.indexOf(string.charAt(i));
    if (index >= 0) {
      return string.indexOf(chars[index]);
    }
  }
  return -1;
};

const parseVersionParts = function(versionPart) {
  const result = {
    numberA: 0,
    numberC: 0
  };

  if (!versionPart) {
    return result;
  }

  if (versionPart === '*') {
    result.numberA = Number.MAX_VALUE;
    result.stringB = '';
    return result;
  } else {
    result.numberA = parseInt(versionPart, 10);
    result.stringB = versionPart.substr(result.numberA.toString().length);
  }

  if (result.stringB[0] === '+') {
    result.stringB = result.stringB.replace('+', 'pre');
    ++result.numberA;
  } else {
    const indexOfNextNumber = strpbrk(result.stringB, '0123456789+-');
    if (indexOfNextNumber >= 0) {
      const extra = result.stringB.substr(indexOfNextNumber);
      const parsedExtra = parseInt(extra, 10);
      if (Number.isInteger(parsedExtra)) {
        result.numberC = parsedExtra;
        result.stringD = result.stringB.slice(indexOfNextNumber + result.numberC.toString().length);
        result.stringB = result.stringB.slice(0, result.stringB.length - extra.length);
      }
    }
  }

  return result;
};

const compare = function(a, b) {
  if (a > b) {
    return 1;
  } else if (a === b) {
    return 0;
  } else {
    return -1;
  }
};

const strcmp = function(str1, str2) {
  if (!str1) {
    return (str2) ? 1 : 0;
  } else if (!str2) {
    return -1;
  } else {
    return compare(str1.replace(/00/g, '0'), str2.replace(/00/g, '0'));
  }
};

const compareVersionPart = function(versionPart1, versionPart2) {
  if (!versionPart1) {
    return -1;
  } else if (!versionPart2) {
    return 1;
  } else {
    let result = compare(versionPart1.numberA, versionPart2.numberA);
    if (result) {
      return result;
    }

    result = strcmp(versionPart1.stringB, versionPart2.stringB);
    if (result) {
      return result;
    }

    result = compare(versionPart1.numberC, versionPart2.numberC);
    if (result) {
      return result;
    }

    result = strcmp(versionPart1.stringD, versionPart2.stringD);
    return result;
  }
};

const compareVersions = function(version1, version2) {
  let result = 0;

  const partsOfVersion1 = version1.split('.');
  const partsOfVersion2 = version2.split('.');

  const maxLength = Math.max(partsOfVersion1.length, partsOfVersion2.length);

  for (let i = 0; i < maxLength; i++) {
    const versionPart1 = parseVersionParts(partsOfVersion1[i]);
    const versionPart2 = parseVersionParts(partsOfVersion2[i]);
    result = compareVersionPart(versionPart1, versionPart2);
    if (result) {
      return result;
    }
  }

  return result;
};

module.exports = function(v1, v2) {
  return compareVersions(v1, v2);
};
