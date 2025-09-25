import React, { useState, useEffect } from 'react'
import { User, LogIn, LogOut, Settings } from 'lucide-react'
import { AuthService, UserService, type UserProfile } from '../services/database'

interface UserAuthProps {
  onUserChange?: (user: any) => void
}

export const UserAuth: React.FC<UserAuthProps> = ({ onUserChange }) => {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取当前用户
    const checkUser = async () => {
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
      setLoading(false)
      
      if (currentUser) {
        // 获取用户配置
        const profile = await UserService.getUserProfile(currentUser.id)
        setUserProfile(profile)
      }
    }

    checkUser()

    // 监听认证状态变化
    const { data: { subscription } } = AuthService.onAuthStateChange(async (newUser) => {
      setUser(newUser)
      onUserChange?.(newUser)
      
      if (newUser) {
        const profile = await UserService.getUserProfile(newUser.id)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [onUserChange])

  const handleSignOut = async () => {
    await AuthService.signOut()
  }

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    if (!user) return

    const updatedProfile = await UserService.upsertUserProfile({
      id: user.id,
      email: user.email,
      ...updates
    })

    if (updatedProfile) {
      setUserProfile(updatedProfile)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
        <span>Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Sign in to save favorites and get personalized recommendations
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <LogIn size={16} />
          <span>Sign In</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          {userProfile?.avatar_url ? (
            <img 
              src={userProfile.avatar_url} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {userProfile?.full_name || user.email}
          </div>
          {userProfile && (
            <div className="text-gray-500 capitalize">
              {userProfile.sport_level} • {userProfile.primary_sport}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowProfile(!showProfile)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Settings size={16} />
      </button>

      <button
        onClick={handleSignOut}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LogOut size={16} />
      </button>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfileModal
          user={user}
          profile={userProfile}
          onClose={() => setShowProfile(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}

interface UserProfileModalProps {
  user: any
  profile: UserProfile | null
  onClose: () => void
  onUpdate: (updates: Partial<UserProfile>) => void
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, profile, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    sport_level: profile?.sport_level || 'beginner',
    primary_sport: profile?.primary_sport || 'triathlon',
    budget_range: profile?.budget_range || 'mid-range',
    training_frequency: profile?.training_frequency || 3,
    preferred_brands: profile?.preferred_brands?.join(', ') || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onUpdate({
      ...formData,
      preferred_brands: formData.preferred_brands.split(',').map(b => b.trim()).filter(Boolean)
    })
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sport Level
            </label>
            <select
              value={formData.sport_level}
              onChange={(e) => setFormData({ ...formData, sport_level: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Sport
            </label>
            <select
              value={formData.primary_sport}
              onChange={(e) => setFormData({ ...formData, primary_sport: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="triathlon">Triathlon</option>
              <option value="swimming">Swimming</option>
              <option value="cycling">Cycling</option>
              <option value="running">Running</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Range
            </label>
            <select
              value={formData.budget_range}
              onChange={(e) => setFormData({ ...formData, budget_range: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="budget">Budget (Under $100)</option>
              <option value="mid-range">Mid-range ($100-$500)</option>
              <option value="premium">Premium ($500+)</option>
              <option value="unlimited">No Limit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Training Frequency (days/week)
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={formData.training_frequency}
              onChange={(e) => setFormData({ ...formData, training_frequency: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Brands (comma-separated)
            </label>
            <input
              type="text"
              value={formData.preferred_brands}
              onChange={(e) => setFormData({ ...formData, preferred_brands: e.target.value })}
              placeholder="Nike, Adidas, Garmin, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}