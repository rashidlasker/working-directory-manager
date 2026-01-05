/**
 * Calculate the similarity between two strings using Dice's coefficient
 * @param {string} sa1 - First string to compare
 * @param {string} sa2 - Second string to compare
 * @returns {number} Similarity score between 0 and 1
 */
function stringSimilarity(sa1, sa2) {
  const s1 = sa1.replace(/\s/g, '').toLowerCase();
  const s2 = sa2.replace(/\s/g, '').toLowerCase();

  /**
   * Find intersection of two arrays
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {Array} Intersection of the two arrays
   */
  function intersect(arr1, arr2) {
    const result = [];
    const lookup = {};

    for (let i = 0; i < arr2.length; i++) {
      lookup[arr2[i]] = true;
    }

    for (let i = 0; i < arr1.length; i++) {
      const value = arr1[i];
      if (value in lookup) {
        result.push(value);
      }
    }

    return result;
  }

  /**
   * Get an array of all pairs of adjacent letters in a string
   * @param {string} s - Input string
   * @returns {Array<string>} Array of character pairs
   */
  function pairs(s) {
    const result = [];
    for (let i = 0; i < s.length - 1; i++) {
      result[i] = s.slice(i, i + 2);
    }
    return result;
  }

  const pairs1 = pairs(s1);
  const pairs2 = pairs(s2);
  const similarityNum = 2 * intersect(pairs1, pairs2).length;
  const similarityDen = pairs1.length + pairs2.length;
  const similarity = similarityNum / similarityDen;

  return similarity;
}

module.exports = { stringSimilarity };
