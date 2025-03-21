// このファイルは、TON（Telegram）クライアントのストア画面です。

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Navigation } from '@shout2/ui/src/components/Navigation/Navigation';
import { PurchaseConfirmationModal } from '@shout2/ui/src/components/Store/PurchaseConfirmationModal';

// ストアアイテムのインターフェース
interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'character' | 'boost' | 'theme' | 'special';
  isLimited: boolean;
  isSoldOut?: boolean;
}

// カテゴリーのインターフェース
interface Category {
  id: string;
  name: string;
  value: 'character' | 'boost' | 'theme' | 'special' | 'all';
}

export default function Store() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useNextScreenEntryExit();
  const { animationsEnabled, animationSpeed } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userPoints, setUserPoints] = useState<number>(1500);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  // カテゴリーリスト
  const categories: Category[] = [
    { id: '1', name: 'すべて', value: 'all' },
    { id: '2', name: 'キャラクター', value: 'character' },
    { id: '3', name: 'ブースト', value: 'boost' },
    { id: '4', name: 'テーマ', value: 'theme' },
    { id: '5', name: '特別アイテム', value: 'special' },
  ];

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          // 認証されていない場合はトップページにリダイレクト
          router.push('/');
          return;
        }

        // APIエンドポイントが実装されるまでのダミーデータ
        // 実際のAPIが実装されたら、このダミーデータは削除してください
        const dummyItems: StoreItem[] = [
          {
            id: '1',
            name: 'ブルーキャラクター',
            description: 'レアなブルーキャラクター。特別な能力を持っています。',
            price: 500,
            image: 'https://placehold.co/300x300/blue/white?text=Blue+Character',
            category: 'character',
            isLimited: true
          },
          {
            id: '2',
            name: 'レッドキャラクター',
            description: '攻撃力が高いレッドキャラクター。',
            price: 400,
            image: 'https://placehold.co/300x300/red/white?text=Red+Character',
            category: 'character',
            isLimited: false
          },
          {
            id: '3',
            name: 'ゴールドキャラクター',
            description: '希少なゴールドキャラクター。ポイント獲得量が増加します。',
            price: 800,
            image: 'https://placehold.co/300x300/gold/white?text=Gold+Character',
            category: 'character',
            isLimited: true,
            isSoldOut: true
          },
          {
            id: '4',
            name: '2倍ブースト',
            description: '24時間、獲得ポイントが2倍になります。',
            price: 200,
            image: 'https://placehold.co/300x300/purple/white?text=2x+Boost',
            category: 'boost',
            isLimited: false
          },
          {
            id: '5',
            name: '3倍ブースト',
            description: '12時間、獲得ポイントが3倍になります。',
            price: 300,
            image: 'https://placehold.co/300x300/purple/white?text=3x+Boost',
            category: 'boost',
            isLimited: false
          },
          {
            id: '6',
            name: 'ダークテーマ',
            description: 'アプリのテーマをダークモードに変更します。',
            price: 150,
            image: 'https://placehold.co/300x300/black/white?text=Dark+Theme',
            category: 'theme',
            isLimited: false
          },
          {
            id: '7',
            name: 'ネオンテーマ',
            description: '鮮やかなネオンカラーのテーマです。',
            price: 200,
            image: 'https://placehold.co/300x300/cyan/white?text=Neon+Theme',
            category: 'theme',
            isLimited: false
          },
          {
            id: '8',
            name: 'VIPパス',
            description: '30日間、VIP特典が利用できます。',
            price: 1000,
            image: 'https://placehold.co/300x300/gold/black?text=VIP+Pass',
            category: 'special',
            isLimited: true
          },
          {
            id: '9',
            name: 'エナジーリフィル',
            description: 'エナジーを完全に回復します。',
            price: 100,
            image: 'https://placehold.co/300x300/green/white?text=Energy+Refill',
            category: 'boost',
            isLimited: false
          },
          {
            id: '10',
            name: 'レアアバター',
            description: '限定のレアアバターです。',
            price: 350,
            image: 'https://placehold.co/300x300/blue/white?text=Rare+Avatar',
            category: 'character',
            isLimited: true
          }
        ];

        setStoreItems(dummyItems);
        setFilteredItems(dummyItems);

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const storeResponse = await fetch('/api/store/items', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!storeResponse.ok) {
          throw new Error('ストアデータの取得に失敗しました。');
        }

        const storeData = await storeResponse.json();
        setStoreItems(storeData.items || []);
        setFilteredItems(storeData.items || []);

        // ユーザーポイントの取得
        const userResponse = await fetch('/api/user/points', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('ユーザーデータの取得に失敗しました。');
        }

        const userData = await userResponse.json();
        setUserPoints(userData.points || 0);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // カテゴリーフィルター
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(storeItems);
    } else {
      setFilteredItems(storeItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, storeItems]);

  // カテゴリー変更ハンドラー
  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
  };

  // アイテム購入ハンドラー
  const handlePurchase = (item: StoreItem) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  // 購入確認ハンドラー
  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;

    try {
      // ポイントが足りない場合
      if (userPoints < selectedItem.price) {
        alert('ポイントが足りません。');
        setShowPurchaseModal(false);
        return;
      }

      // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
      /*
      const response = await fetch('/api/store/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
        }),
      });

      if (!response.ok) {
        throw new Error('購入に失敗しました。');
      }

      const data = await response.json();
      */

      // ダミーの購入処理
      setUserPoints(userPoints - selectedItem.price);
      
      // 購入成功メッセージ
      alert(`${selectedItem.name}を購入しました！`);
      
      setShowPurchaseModal(false);
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert(error.message || '購入中にエラーが発生しました。');
      setShowPurchaseModal(false);
    }
  };

  // 購入キャンセルハンドラー
  const handleCancelPurchase = () => {
    setShowPurchaseModal(false);
    setSelectedItem(null);
  };

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    if (animationsEnabled) {
      navigateWithExitAnimation(path);
    } else {
      router.push(path);
    }
  };

  // プロフィールクリック処理
  const handleProfileClick = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/profile');
    } else {
      router.push('/profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
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
        <div className="text-white text-xl font-bold">ストア</div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        {/* ポイント表示 */}
        <div className={`flex justify-end px-4 mb-4 ${isLoaded && animationsEnabled ? 'store-item-animate-entry' : ''}`}>
          <div className="bg-blue-900/50 rounded-full px-4 py-2 flex items-center">
            <img
              className="w-5 h-5 mr-2"
              alt="Points"
              src="https://c.animaapp.com/sVl5C9mT/img/coins.svg"
            />
            <span className="font-bold text-white">{userPoints.toLocaleString()}</span>
          </div>
        </div>

        {/* カテゴリー選択 */}
        <div className={`px-4 mb-6 overflow-x-auto ${isLoaded && animationsEnabled ? 'store-item-animate-entry delay-1' : ''}`}>
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* アイテムグリッド */}
        <div className={`px-4 ${isLoaded && animationsEnabled ? 'store-item-animate-entry delay-2' : ''}`}>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              この分類のアイテムはありません。
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-gray-800/50 rounded-lg overflow-hidden ${
                    item.isSoldOut ? 'opacity-60' : ''
                  } ${isLoaded && animationsEnabled ? `store-item-animate-entry delay-${index + 3}` : ''}`}
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                    {item.isLimited && !item.isSoldOut && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                        限定
                      </div>
                    )}
                    {item.isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <span className="text-white font-bold text-lg">売り切れ</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          className="w-4 h-4 mr-1"
                          alt="Points"
                          src="https://c.animaapp.com/sVl5C9mT/img/coins.svg"
                        />
                        <span className="font-bold text-white">{item.price}</span>
                      </div>
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={item.isSoldOut || userPoints < item.price}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          item.isSoldOut
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : userPoints < item.price
                            ? 'bg-red-900/50 text-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {item.isSoldOut
                          ? '売り切れ'
                          : userPoints < item.price
                          ? 'ポイント不足'
                          : '購入'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Navigation 
        currentPath={pathname} 
        onNavigate={handleNavigation} 
      />

      {/* 購入確認モーダル */}
      {showPurchaseModal && selectedItem && (
        <PurchaseConfirmationModal
          isOpen={showPurchaseModal}
          onOpenChange={setShowPurchaseModal}
          item={{
            id: parseInt(selectedItem.id),
            title: selectedItem.name,
            description: selectedItem.description,
            price: selectedItem.price,
            image: selectedItem.image
          }}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </MainLayout>
  );
}
