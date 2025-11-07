// src/app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Save, X, Mail, Phone, MapPin, Calendar, AlertCircle, Check, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  date_of_birth?: string;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    date_of_birth: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setFormData({
          full_name: data.user.full_name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          country: data.user.country || '',
          pincode: data.user.pincode || '',
          date_of_birth: data.user.date_of_birth || '',
        });
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        pincode: profile.pincode || '',
        date_of_birth: profile.date_of_birth || '',
      });
    }
    setEditing(false);
    setError('');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard">
          <button className="flex items-center transition-colors group" style={{ color: 'var(--card-text-secondary)' }}>
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </Link>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start"
        >
          <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-600 text-sm">{success}</p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start"
        >
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="rounded-2xl p-8 shadow-lg h-full" style={{ backgroundColor: 'var(--card-bg)' }}>
            {/* Profile Avatar */}
            <div className="text-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <span className="text-5xl font-bold text-white">{getInitials(profile?.full_name || 'User')}</span>
              </motion.div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
                {profile?.full_name.toUpperCase() || 'USER'}
              </h2>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                <p className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>Member Since</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--card-text)' }}>
                  {profile?.created_at ? formatDate(profile.created_at) : '-'}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                <p className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>Account Status</p>
                <p className="text-sm font-semibold text-green-600">Active</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 b-0">
              {!editing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditing(true)}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </motion.button>
              )}
              <button className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-colors" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Profile Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--card-text)' }}>
              {editing ? 'Edit Your Information' : 'Account Information'}
            </h3>

            <div className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--card-text-secondary)' }}>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        style={{
                          backgroundColor: 'var(--card-bg-alt)',
                          borderColor: 'var(--card-bg-alt)',
                          color: 'var(--card-text)'
                        }}
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                        <p style={{ color: 'var(--card-text)' }}>{profile?.full_name || '-'}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Date of Birth */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        style={{
                          backgroundColor: 'var(--card-bg-alt)',
                          borderColor: 'var(--card-bg-alt)',
                          color: 'var(--card-text)'
                        }}
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                        <Calendar className="h-4 w-4 mr-2" style={{ color: 'var(--card-text-secondary)' }} />
                        <p style={{ color: 'var(--card-text)' }}>{formData.date_of_birth ? formatDate(formData.date_of_birth) : '-'}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="pt-6 border-t" style={{ borderColor: 'var(--card-bg-alt)' }}>
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--card-text-secondary)' }}>
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                      Email Address
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        style={{
                          backgroundColor: 'var(--card-bg-alt)',
                          borderColor: 'var(--card-bg-alt)',
                          color: 'var(--card-text)'
                        }}
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                        <Mail className="h-4 w-4 mr-2" style={{ color: 'var(--card-text-secondary)' }} />
                        <p style={{ color: 'var(--card-text)' }}>{profile?.email || '-'}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        style={{
                          backgroundColor: 'var(--card-bg-alt)',
                          borderColor: 'var(--card-bg-alt)',
                          color: 'var(--card-text)'
                        }}
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                        <Phone className="h-4 w-4 mr-2" style={{ color: 'var(--card-text-secondary)' }} />
                        <p style={{ color: 'var(--card-text)' }}>{profile?.phone || '-'}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="pt-6 border-t" style={{ borderColor: 'var(--card-bg-alt)' }}>
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--card-text-secondary)' }}>
                  Address
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {/* Street Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                      Street Address
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="123 Main Street"
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        style={{
                          backgroundColor: 'var(--card-bg-alt)',
                          borderColor: 'var(--card-bg-alt)',
                          color: 'var(--card-text)'
                        }}
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                        <MapPin className="h-4 w-4 mr-2" style={{ color: 'var(--card-text-secondary)' }} />
                        <p style={{ color: 'var(--card-text)' }}>{profile?.address || '-'}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* City, State, Country, Pincode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                        City
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="New York"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                          style={{
                            backgroundColor: 'var(--card-bg-alt)',
                            borderColor: 'var(--card-bg-alt)',
                            color: 'var(--card-text)'
                          }}
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
                          {profile?.city || '-'}
                        </p>
                      )}
                    </motion.div>

                    {/* State */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                        State / Province
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="New York"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                          style={{
                            backgroundColor: 'var(--card-bg-alt)',
                            borderColor: 'var(--card-bg-alt)',
                            color: 'var(--card-text)'
                          }}
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
                          {profile?.state || '-'}
                        </p>
                      )}
                    </motion.div>

                    {/* Country */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                        Country
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="United States"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                          style={{
                            backgroundColor: 'var(--card-bg-alt)',
                            borderColor: 'var(--card-bg-alt)',
                            color: 'var(--card-text)'
                          }}
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
                          {profile?.country || '-'}
                        </p>
                      )}
                    </motion.div>

                    {/* Pincode */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                        Postal / Zip Code
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="10001"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                          style={{
                            backgroundColor: 'var(--card-bg-alt)',
                            borderColor: 'var(--card-bg-alt)',
                            color: 'var(--card-text)'
                          }}
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
                          {profile?.pincode || '-'}
                        </p>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-3 mt-8 pt-6 border-t" style={{ borderColor: 'var(--card-bg-alt)' }}
              >
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
                >
                  <X className="h-4 w-4 inline mr-2" />
                  Cancel
                </button>
                <motion.button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
