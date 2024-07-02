import styles from './login.module.css'; // Import CSS module
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/Authcontext';

const RegisterForm = ({ className }) => {
  // Handle form submission
  const [formData, setFormData] = useState({
    username:'',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    dob: '',
    password: '',
    retypePassword: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    register(formData.username, formData.first_name, formData.last_name, formData.email, formData.gender, formData.dob, formData.password);
  };
  const calculateMinDate=()=> {
    var today = new Date();
    var minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  }
  useEffect(() => {
    setFormData({
      ...formData,
      dob: calculateMinDate(),
    });
  },[]);  
  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    // form validation
    <form onSubmit={handleSubmit} className={`${styles.formContainer} ${className}`}>
      <h2 className={styles.title}>Register</h2>
      <input type="text" value={formData.username} name="username" placeholder="User Name" onChange={handleChange} className={styles.inputField} />
      <input type="text" value={formData.first_name} name="first_name" placeholder="First Name" onChange={handleChange} className={styles.inputField} />
      <input type="text" value={formData.last_name} name="last_name" placeholder="Last Name" onChange={handleChange} className={styles.inputField} />
      <input type="Password" value={formData.password} name="password" placeholder="Password" onChange={handleChange} className={styles.inputField} />
      <input type="Password" value={formData.retypePassword} name="retypePassword" placeholder="Retype Password" onChange={handleChange} className={styles.inputField} />
      {
        // match password
        (formData.password !== formData.retypePassword && formData.password !== '' && formData.retypePassword !== '') ? <p color='red'>Passwords do not match</p> : null
      }
      <input type="email" value={formData.email} name="email" placeholder="Email" onChange={handleChange} required className={styles.inputField} />
      <input type="date" value={formData.dob} min={calculateMinDate} name="dob" onChange={handleChange} className={styles.inputField} />
      <select name="gender" value={formData.gender} onChange={handleChange} className={styles.inputField}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
      <p color='red'>{error}</p>
      <button type="submit" className={styles.button} disabled={formData.password !== formData.retypePassword || formData.username == '' || formData.first_name 
      == '' || formData.password == '' || formData.retypePassword == '' || formData.gender == "" || formData.email == '' || formData.dob == ""}>Register</button>
    </form>
  );
};

export default RegisterForm;
