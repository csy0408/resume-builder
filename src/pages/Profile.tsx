import { useProfileStore } from '../store/profileStore';
import PhotoUpload from '../components/common/PhotoUpload';
import ExperienceList from '../components/experience/ExperienceList';
import type { BasicInfo } from '../types/profile';

export default function Profile() {
  const { profile, updateBasicInfo } = useProfileStore();

  const handleChange = (field: keyof BasicInfo, value: string) => {
    updateBasicInfo({ [field]: value });
  };

  return (
    <div>
      <section>
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-4">基本信息</h3>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex gap-8 items-start">
            <PhotoUpload
              photo={profile.basic.photo}
              onChange={(photo) => updateBasicInfo({ photo })}
            />
            <div className="grid grid-cols-2 gap-4 flex-1">
              {[
                { key: 'name', label: '姓名', placeholder: '张三' },
                { key: 'phone', label: '手机', placeholder: '138xxxx' },
                { key: 'email', label: '邮箱', placeholder: 'zhangsan@example.com' },
                { key: 'location', label: '所在地', placeholder: '北京' },
                { key: 'github', label: 'GitHub', placeholder: 'github.com/xxx' },
                { key: 'website', label: '个人网站', placeholder: 'https://xxx.com' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-500 mb-1">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={profile.basic[key as keyof BasicInfo] || ''}
                    onChange={(e) => handleChange(key as keyof BasicInfo, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ExperienceList />
    </div>
  );
}
