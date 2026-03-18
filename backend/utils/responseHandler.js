/**
 * 성공 응답 포맷 생성 함수
 * @param {any} data - 클라이언트에 전달할 데이터
 * @returns {object} - { success: true, data, error: null }
 */
const createSuccess = (data) => {
  return {
    success: true,
    data: data,
    error: null
  };
};

/**
 * 실패 응답 포맷 생성 함수
 * @param {number} status - HTTP 상태 코드
 * @param {string} message - 에러 메시지
 * @returns {object} - { success: false, data: null, error: { status, message } }
 */
const createError = (status, message) => {
  return {
    success: false,
    data: null,
    error: {
      status,
      message
    }
  };
};

module.exports = {
  createSuccess,
  createError
};
