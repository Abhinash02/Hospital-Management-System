import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      return toast.error('Please fill in all fields');
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(isLogin ? 'Successfully logged in!' : 'Successfully registered!');
        window.dispatchEvent(new Event('storage')); // Trigger Navbar update
        
        if (data.user.role === 'superadmin') navigate('/superadmin');
        else if (data.user.role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-medical-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-medical-blue/40 mix-blend-multiply z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80" 
          alt="Hospital hallway" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-md">
            Welcome to <br/>Medpark Hospital
          </h1>
          <p className="text-xl max-w-md font-medium drop-shadow-md text-gray-100">
            Providing world-class healthcare, advanced medical facilities, and compassionate care to our community.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-medical-dark mb-2">
              {isLogin ? 'Login to MediCare' : 'Create an Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Welcome back! Please enter your details.' : 'Join our healthcare portal today.'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-medical-blue hover:bg-medical-dark text-white font-bold py-3.5 rounded-lg shadow-md transition-colors mt-2"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 border-t pt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="font-bold text-medical-blue hover:text-medical-dark transition-colors focus:outline-none"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
