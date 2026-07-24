/**
 * 第8章 配套代码示例
 * 主题：完整的注册表单 —— 验证逻辑、错误提示
 * 使用方式：将代码复制到 React 项目的组件文件中使用
 * 功能列表：
 *   - 用户名验证（长度、格式）
 *   - 邮箱格式验证
 *   - 密码强度验证
 *   - 确认密码匹配
 *   - 手机号格式验证
 *   - 实时验证 + 提交时验证
 *   - 表单提交成功/失败反馈
 */

import { useState } from 'react';

// ========================================
// 1. 验证规则定义
// ========================================
// 将验证逻辑抽离为纯函数，方便测试和复用
const validators = {
  // 用户名验证
  username(value) {
    if (!value.trim()) return '用户名不能为空';
    if (value.length < 3) return '用户名至少 3 个字符';
    if (value.length > 20) return '用户名不能超过 20 个字符';
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
      return '用户名只能包含字母、数字、下划线和中文';
    }
    return ''; // 返回空字符串表示验证通过
  },

  // 邮箱验证
  email(value) {
    if (!value.trim()) return '邮箱不能为空';
    // 简单的邮箱正则表达式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '请输入有效的邮箱地址';
    }
    return '';
  },

  // 密码验证
  password(value) {
    if (!value) return '密码不能为空';
    if (value.length < 8) return '密码至少 8 个字符';
    if (!/[A-Z]/.test(value)) return '密码需要包含至少一个大写字母';
    if (!/[a-z]/.test(value)) return '密码需要包含至少一个小写字母';
    if (!/[0-9]/.test(value)) return '密码需要包含至少一个数字';
    return '';
  },

  // 确认密码验证（需要与密码对比）
  confirmPassword(value, password) {
    if (!value) return '请确认密码';
    if (value !== password) return '两次输入的密码不一致';
    return '';
  },

  // 手机号验证
  phone(value) {
    if (!value.trim()) return '手机号不能为空';
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return '请输入有效的手机号码';
    }
    return '';
  },
};

// ========================================
// 2. FormField 组件 —— 通用表单字段
// ========================================
/**
 * 通用表单字段组件，封装了 label、input、error 的展示
 */
function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '4px',
          fontWeight: 'bold',
          fontSize: '14px',
          color: error ? '#d32f2f' : '#333',
        }}
      >
        {label}
      </label>
      {children}
      {/* 错误提示：有错误时才显示 */}
      {error && (
        <p
          style={{
            margin: '4px 0 0 0',
            color: '#d32f2f',
            fontSize: '13px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ========================================
// 3. 密码强度指示器
// ========================================
function PasswordStrength({ password }) {
  // 计算密码强度等级
  function getStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  const strength = getStrength(password);

  // 根据强度等级定义颜色和文字
  const levels = [
    { color: '#e0e0e0', text: '', width: '0%' },
    { color: '#d32f2f', text: '很弱', width: '20%' },
    { color: '#f57c00', text: '弱', width: '40%' },
    { color: '#fbc02d', text: '一般', width: '60%' },
    { color: '#7cb342', text: '强', width: '80%' },
    { color: '#2e7d32', text: '很强', width: '100%' },
  ];

  const level = levels[strength];

  return (
    <div style={{ marginTop: '4px' }}>
      {/* 强度条背景 */}
      <div style={{ height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}>
        {/* 强度条填充 */}
        <div
          style={{
            height: '100%',
            width: level.width,
            backgroundColor: level.color,
            borderRadius: '2px',
            transition: 'all 0.3s',
          }}
        />
      </div>
      {/* 强度文字 */}
      {level.text && (
        <span style={{ fontSize: '12px', color: level.color }}>
          密码强度：{level.text}
        </span>
      )}
    </div>
  );
}

// ========================================
// 4. RegistrationForm 组件 —— 完整的注册表单
// ========================================
function RegistrationForm() {
  // 表单字段状态
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
  });

  // 各字段的错误信息
  const [errors, setErrors] = useState({});

  // 哪些字段已经被用户"触碰"过（失去焦点后才显示错误）
  const [touched, setTouched] = useState({});

  // 提交状态
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | submitting | success

  // ---- 更新表单字段 ----
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // 实时验证（只验证已触碰过的字段）
    if (touched[name]) {
      validateField(name, newValue);
    }
  }

  // ---- 验证单个字段 ----
  function validateField(fieldName, value) {
    let error = '';

    switch (fieldName) {
      case 'username':
        error = validators.username(value);
        break;
      case 'email':
        error = validators.email(value);
        break;
      case 'password':
        error = validators.password(value);
        // 密码变化时，也需要重新验证确认密码
        if (touched.confirmPassword) {
          const confirmError = validators.confirmPassword(
            formData.confirmPassword,
            value
          );
          setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
        break;
      case 'confirmPassword':
        error = validators.confirmPassword(value, formData.password);
        break;
      case 'phone':
        error = validators.phone(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  }

  // ---- 字段失去焦点时标记为"已触碰" ----
  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // 失去焦点时立即验证
    validateField(name, formData[name]);
  }

  // ---- 验证所有字段 ----
  function validateAll() {
    const newErrors = {
      username: validators.username(formData.username),
      email: validators.email(formData.email),
      password: validators.password(formData.password),
      confirmPassword: validators.confirmPassword(
        formData.confirmPassword,
        formData.password
      ),
      phone: validators.phone(formData.phone),
    };

    setErrors(newErrors);

    // 将所有字段标记为已触碰
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    });

    // 检查是否有错误
    return Object.values(newErrors).every((err) => err === '');
  }

  // ---- 表单提交 ----
  async function handleSubmit(e) {
    e.preventDefault();

    // 验证所有字段
    if (!validateAll()) {
      return; // 验证不通过，不提交
    }

    // 检查是否勾选了协议
    if (!formData.agreeTerms) {
      alert('请先阅读并同意服务条款');
      return;
    }

    // 模拟提交过程
    setSubmitStatus('submitting');

    // 模拟 API 请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 提交成功
    setSubmitStatus('success');
    console.log('注册数据：', formData);
  }

  // ---- 输入框的通用样式 ----
  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '10px 12px',
    fontSize: '16px',
    border: `2px solid ${touched[fieldName] && errors[fieldName] ? '#d32f2f' : '#ddd'}`,
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  // 提交成功后显示成功页面
  if (submitStatus === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: '#2e7d32' }}>注册成功！</h2>
        <p>欢迎你，{formData.username}！</p>
        <button
          onClick={() => {
            setFormData({
              username: '', email: '', password: '',
              confirmPassword: '', phone: '', agreeTerms: false,
            });
            setErrors({});
            setTouched({});
            setSubmitStatus('idle');
          }}
          style={{ padding: '10px 24px', fontSize: '16px', cursor: 'pointer' }}
        >
          返回注册页
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 用户名 */}
      <FormField label="用户名" error={touched.username && errors.username}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="3-20 个字符，支持中英文和数字"
          style={inputStyle('username')}
        />
      </FormField>

      {/* 邮箱 */}
      <FormField label="邮箱" error={touched.email && errors.email}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="example@domain.com"
          style={inputStyle('email')}
        />
      </FormField>

      {/* 密码 */}
      <FormField label="密码" error={touched.password && errors.password}>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="至少 8 位，包含大小写字母和数字"
          style={inputStyle('password')}
        />
        {/* 密码强度指示器 */}
        <PasswordStrength password={formData.password} />
      </FormField>

      {/* 确认密码 */}
      <FormField label="确认密码" error={touched.confirmPassword && errors.confirmPassword}>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="再次输入密码"
          style={inputStyle('confirmPassword')}
        />
      </FormField>

      {/* 手机号 */}
      <FormField label="手机号" error={touched.phone && errors.phone}>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="请输入 11 位手机号"
          style={inputStyle('phone')}
        />
      </FormField>

      {/* 服务条款 */}
      <div style={{ marginBottom: '16px' }}>
        <label>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
          />
          {' '}我已阅读并同意<a href="#" style={{ color: '#1976d2' }}>服务条款</a>
        </label>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={submitStatus === 'submitting'}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          backgroundColor: submitStatus === 'submitting' ? '#90caf9' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: submitStatus === 'submitting' ? 'not-allowed' : 'pointer',
        }}
      >
        {submitStatus === 'submitting' ? '注册中...' : '注册'}
      </button>
    </form>
  );
}

// ========================================
// 5. 主应用组件
// ========================================
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>用户注册</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        请填写以下信息完成注册，所有字段均为必填。
      </p>
      <RegistrationForm />
    </div>
  );
}

export default App;
