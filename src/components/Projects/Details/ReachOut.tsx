import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  bestTime: string;
  referralSource: string;
  comments: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bestTime?: string;
  comments?: string;
}

export default function ReachOut() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: '',
    bestTime: '',
    referralSource: '',
    comments: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.bestTime) {
      newErrors.bestTime = 'Please select a time';
    }
    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        propertyType: '',
        bestTime: '',
        referralSource: '',
        comments: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" id='reachOut'>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Reach Out</h1>
        <p className="text-gray-600 mb-8 pb-8 border-b border-gray-200">
          Let us know to give you a call about any questions you might have.
        </p>

        <div className="space-y-6">
          {/* Name Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-600">(Required)</span>
              </label>
              <span className="block text-xs text-gray-600 mb-1">First</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 invisible">
                Last Name
              </label>
              <span className="block text-xs text-gray-600 mb-1">Last</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-600">(Required)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Phone <span className="text-red-600">(Required)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What offering are you interested in?
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="">Select a property type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land</option>
            </select>
            <p className="mt-2 text-sm text-gray-600">
              You can also ask about our other offerings even when you choose a specific option here.
            </p>
          </div>

          {/* Best Time and Referral Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Best Time to Call You <span className="text-red-600">(Required)</span>
              </label>
              <select
                name="bestTime"
                value={formData.bestTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option value="">Select A Time</option>
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 5pm)</option>
                <option value="evening">Evening (5pm - 8pm)</option>
              </select>
              {errors.bestTime && (
                <p className="mt-1 text-sm text-red-600">{errors.bestTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How did you hear about us?
              </label>
              <input
                type="text"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                placeholder="E.g. John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What's on your mind?
            </h2>
            <p className="text-gray-600 mb-6 pb-6 border-b border-gray-200">
              Please let us know what's on your mind. Have a question for us? Ask and we'll try to answer every question when we call you during your available hours
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Comments/Questions <span className="text-red-600">(Required)</span>
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none resize-none"
              />
              {errors.comments && (
                <p className="mt-1 text-sm text-red-600">{errors.comments}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary text-white font-semibold px-8 py-3 rounded transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}