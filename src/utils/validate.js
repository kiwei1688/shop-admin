// 驗證帳號輸入內容
const validate_account = (rule, value, callback) => {
  // 驗證是否輸入5-20個字串
  const reg = /^(?=.*[A-z])(?=.*\d)[^]{5,20}$/;

  if (!reg.test(value)) {
    return callback(new Error('請輸入5-20個字元'));
  }
  callback();
};

// 驗證密碼輸入內容
const validate_password = (rule, value, callback) => {
  const reg = /^(?=.*[A-z])(?=.*\d)[^]{7,20}$/;

  if (!reg.test(value)) {
    return callback(new Error('密碼需包含英文及數字'));
  }
  callback();
};

export { validate_account, validate_password };