'use client';

// このファイルは、共通の設定ページコンポーネントです。
// ton-clientとline-clientの両方で使用されます。
// React Router依存部分をNext.js互換に変換し、テーマプロパティを追加しています。

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUnifiedScreenEntryExit } from '../hooks/useUnifiedScreenEntryExit';
import { useAnimationSettings } from '../contexts/AnimationSettingsContext';
import { useNavigation } from '../contexts/UnifiedNavigationContext';
import { z } from 'zod';

// 個別にコンポーネントをインポート
import MainLayout from '../components/MainLayout/MainLayout';
import { Header } from '../components/Header/Header';
import { Navigation } from '../components/Navigation/Navigation';
import { LanguageSelectionModal } from '../components/Settings/LanguageSelectionModal';

// Zodスキーマ定義
const SettingItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['toggle', 'select', 'button', 'info']),
  value: z.union([z.boolean(), z.string(), z.number()]).optional(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ).optional(),
  action: z.function().args().returns(z.void()).optional()
});

const SettingGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(SettingItemSchema)
});

export const SettingsPagePropsSchema = z.object({
  theme: z.enum(['blue', 'green']).default('blue'),
  initialSettings: z.array(SettingGroupSchema).optional()
});

// 型定義（TypeScriptの型推論を活用）
export type SettingItem = z.infer<typeof SettingItemSchema>;
export type SettingGroup = z.infer<typeof SettingGroupSchema>;
export type SettingsPageProps = z.infer<typeof SettingsPagePropsSchema>;

// 共通のユーティリティ関数
const createThemeStyles = (theme: 'blue' | 'green') => ({
  primary: theme === 'blue' ? 'bg-blue-600' : 'bg-green-600',
  hover: theme === 'blue' ? 'hover:bg-blue-700' : 'hover:bg-green-700',
  loading: theme === 'blue' ? 'from-blue-900' : 'from-green-900',
  border: theme === 'blue' ? 'border-blue-500' : 'border-green-500',
  ring: theme === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-green-500',
});

export function SettingsPage({
  theme = 'blue',
  initialSettings
}: SettingsPageProps) {
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useUnifiedScreenEntryExit(pathname);
  const { navigateWithAnimation } = useNavigation();
  const { animationsEnabled } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingGroups, setSettingGroups] = useState<SettingGroup[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('japanese');

  // テーマに基づくスタイルの設定
  const themeStyles = createThemeStyles(theme);

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 初期設定が提供されている場合はそれを使用
        if (initialSettings) {
          setSettingGroups(initialSettings);
          setSelectedLanguage(initialSettings
            .find(group => group.id === 'appearance')
            ?.items.find(item => item.id === 'language')
            ?.value as string || 'japanese');
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          // 認証されていない場合はトップページにリダイレクト
          if (animationsEnabled) {
            navigateWithExitAnimation('/');
          } else {
            navigateWithAnimation('/');
          }
          return;
        }

        // APIエンドポイントが実装されるまでのダミーデータ
        // 実際のAPIが実装されたら、このダミーデータは削除してください
        const dummySettingGroups: SettingGroup[] = [
          {
            id: 'account',
            title: 'アカウント設定',
            items: [
              {
                id: 'profile',
                title: 'プロフィール',
                description: 'プロフィール情報を編集します',
                type: 'button',
                action: () => navigateWithAnimation('/profile')
              },
              {
                id: 'username',
                title: 'ユーザー名',
                description: theme === 'blue' ? 'H1ro5' : 'LINEユーザー',
                type: 'info'
              },
              {
                id: 'email',
                title: 'メールアドレス',
                description: theme === 'blue' ? 'user@example.com' : 'line@example.com',
                type: 'info'
              }
            ]
          },
          {
            id: 'notifications',
            title: '通知設定',
            items: [
              {
                id: 'push_notifications',
                title: 'プッシュ通知',
                description: 'アプリからのプッシュ通知を受け取ります',
                type: 'toggle',
                value: true
              },
              {
                id: 'quest_notifications',
                title: 'クエスト通知',
                description: '新しいクエストが利用可能になったときに通知します',
                type: 'toggle',
                value: true
              },
              {
                id: 'event_notifications',
                title: 'イベント通知',
                description: '新しいイベントが開始されるときに通知します',
                type: 'toggle',
                value: true
              },
              {
                id: 'ranking_notifications',
                title: 'ランキング通知',
                description: 'ランキングの順位が変動したときに通知します',
                type: 'toggle',
                value: false
              }
            ]
          },
          {
            id: 'appearance',
            title: '表示設定',
            items: [
              {
                id: 'language',
                title: '言語',
                description: '日本語',
                type: 'select',
                value: 'japanese',
                options: [
                  { label: '日本語', value: 'japanese' },
                  { label: 'English', value: 'english' },
                  { label: '中文', value: 'chinese' },
                  { label: '한국어', value: 'korean' }
                ]
              },
              {
                id: 'theme',
                title: 'テーマ',
                description: 'ダークモード',
                type: 'select',
                value: 'dark',
                options: [
                  { label: 'ライト', value: 'light' },
                  { label: 'ダーク', value: 'dark' },
                  { label: 'システム設定に合わせる', value: 'system' }
                ]
              }
            ]
          },
          {
            id: 'privacy',
            title: 'プライバシー設定',
            items: [
              {
                id: 'data_collection',
                title: 'データ収集',
                description: 'アプリの改善のためにデータを収集します',
                type: 'toggle',
                value: true
              },
              {
                id: 'profile_visibility',
                title: 'プロフィール公開',
                description: '他のユーザーにプロフィールを公開します',
                type: 'toggle',
                value: true
              }
            ]
          },
          {
            id: 'about',
            title: 'アプリについて',
            items: [
              {
                id: 'version',
                title: 'バージョン',
                description: '1.0.0',
                type: 'info'
              },
              {
                id: 'terms',
                title: '利用規約',
                description: '利用規約を表示します',
                type: 'button',
                action: () => window.open('/terms', '_blank')
              },
              {
                id: 'privacy_policy',
                title: 'プライバシーポリシー',
                description: 'プライバシーポリシーを表示します',
                type: 'button',
                action: () => window.open('/privacy', '_blank')
              }
            ]
          }
        ];

        setSettingGroups(dummySettingGroups);
        setSelectedLanguage(dummySettingGroups
          .find(group => group.id === 'appearance')
          ?.items.find(item => item.id === 'language')
          ?.value as string || 'japanese');

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('設定データの取得に失敗しました。');
        }

        const data = await response.json();
        setSettingGroups(data.settingGroups || []);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [theme, initialSettings, navigateWithAnimation, navigateWithExitAnimation, animationsEnabled]);

  // トグル設定の変更ハンドラー
  const handleToggleChange = (groupId: string, itemId: string, newValue: boolean) => {
    setSettingGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? {
              ...group,
              items: group.items.map(item => 
                item.id === itemId 
                  ? { ...item, value: newValue }
                  : item
              )
            }
          : group
      )
    );

    // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
    /*
    fetch('/api/settings/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settingId: itemId,
        value: newValue,
      }),
    });
    */
  };

  // 選択設定の変更ハンドラー
  const handleSelectChange = (groupId: string, itemId: string, newValue: string) => {
    // 言語設定の場合は言語選択モーダルを表示
    if (itemId === 'language') {
      setSelectedLanguage(newValue);
      setShowLanguageModal(true);
      return;
    }

    setSettingGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? {
              ...group,
              items: group.items.map(item => 
                item.id === itemId 
                  ? { ...item, value: newValue }
                  : item
              )
            }
          : group
      )
    );

    // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
    /*
    fetch('/api/settings/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settingId: itemId,
        value: newValue,
      }),
    });
    */
  };

  // 言語変更ハンドラー
  const handleLanguageSelect = (language: string) => {
    // 言語設定を更新
    setSettingGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === 'appearance' 
          ? {
              ...group,
              items: group.items.map(item => 
                item.id === 'language' 
                  ? { 
                      ...item, 
                      value: language,
                      description: item.options?.find(opt => opt.value === language)?.label || '日本語'
                    }
                  : item
              )
            }
          : group
      )
    );

    // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
    /*
    fetch('/api/settings/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settingId: 'language',
        value: language,
      }),
    });
    */
  };

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    if (animationsEnabled) {
      navigateWithExitAnimation(path);
    } else {
      navigateWithAnimation(path);
    }
  };

  // プロフィールクリック処理
  const handleProfileClick = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/profile');
    } else {
      navigateWithAnimation('/profile');
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    if (animationsEnabled) {
      navigateWithExitAnimation('/');
    } else {
      navigateWithAnimation('/');
    }
  };

  if (isLoading) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b ${themeStyles.loading} to-black text-white`}>
        <div className={`w-16 h-16 border-4 ${themeStyles.border} border-t-transparent rounded-full animate-spin`}></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b ${themeStyles.loading} to-black text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => handleNavigation('/')}
            className={`w-full ${themeStyles.primary} ${themeStyles.hover} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Header onProfileClick={handleProfileClick}>
        <div className="text-white text-xl font-bold">設定</div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        <div className="px-4 space-y-6">
          {settingGroups.map((group, groupIndex) => (
            <div key={group.id} className={`bg-gray-800/50 rounded-lg overflow-hidden ${isLoaded && animationsEnabled ? `settings-card-animate-entry delay-${groupIndex}` : ''}`}>
              <div className="px-4 py-3 bg-gray-900/50">
                <h2 className="text-lg font-medium text-white">{group.title}</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {group.items.map((item) => (
                  <div key={item.id} className="px-4 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                      </div>
                      
                      {item.type === 'toggle' && (
                        <button
                          onClick={() => handleToggleChange(group.id, item.id, !(item.value as boolean))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            item.value ? themeStyles.primary : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}

                      {item.type === 'select' && (
                        <select
                          value={item.value as string}
                          onChange={(e) => handleSelectChange(group.id, item.id, e.target.value)}
                          className={`bg-gray-700 text-white rounded px-3 py-1 focus:outline-none focus:ring-2 ${themeStyles.ring}`}
                        >
                          {item.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {item.type === 'button' && (
                        <button
                          onClick={item.action}
                          className={`${themeStyles.primary} ${themeStyles.hover} text-white px-3 py-1 rounded focus:outline-none focus:ring-2 ${themeStyles.ring} transition duration-300`}
                        >
                          表示
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ログアウトボタン */}
          <div className={`mt-6 ${isLoaded && animationsEnabled ? 'settings-card-animate-entry delay-5' : ''}`}>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
      
      <Navigation 
        currentPath={pathname} 
        onNavigate={handleNavigation} 
      />

      {/* 言語選択モーダル */}
      {showLanguageModal && (
        <LanguageSelectionModal
          isOpen={showLanguageModal}
          onOpenChange={setShowLanguageModal}
          currentLanguage={selectedLanguage}
          onSelectLanguage={handleLanguageSelect}
        />
      )}
    </MainLayout>
  );
}
