import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import MainLayout from "../../components/MainLayout";

export const Player = (): JSX.Element => {
  // Player data
  const playerData = {
    name: "player123",
    title: "RHYTHM MASTER",
    level: 99,
    xp: 9999,
    trophies: 99,
    coins: 9999,
    lootboxes: 99,
    medals: 99,
    role: "creator",
  };

  // Collection items
  const collectionItems = [
    {
      name: "sakura",
      image: "https://c.animaapp.com/exiB2870/img/image-2-1@2x.png",
      rarity: "common",
      rarityColor: "#61cbf4",
      textColor: "text-black",
    },
    {
      name: "sakura",
      image: "https://c.animaapp.com/exiB2870/img/image-2-1@2x.png",
      rarity: "super rare",
      rarityColor: "#6f30a4",
      textColor: "text-white",
    },
  ];

  return (
    <MainLayout>
      {/* Player content */}
      <div className="flex flex-col items-center gap-2.5 px-2 py-0 relative flex-1 self-stretch w-full grow mb-20 mt-[90px]">
        <div className="flex flex-col items-start gap-[13px] px-4 py-[18px] relative self-stretch w-full flex-[0_0_auto]">
          {/* Player profile card */}
          <Card className="flex flex-col items-center gap-[13px] px-0 py-0 relative self-stretch w-full rounded-[14px] overflow-hidden border-0">
            <CardContent className="flex flex-col items-center gap-[13px] p-4 relative self-stretch w-full">
              {/* Player avatar and info */}
              <div className="flex flex-col items-center gap-[5px] relative self-stretch w-full">
                <Avatar className="w-[100px] h-[100px] bg-[#d9d9d9] rounded-full">
                  <AvatarFallback />
                </Avatar>
                
                <div className="flex flex-col items-center gap-[2px] relative self-stretch w-full">
                  <div className="relative w-fit [font-family:'Good_Times-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                    {playerData.name}
                  </div>
                  
                  <div className="flex items-center gap-[5px] relative self-stretch w-full justify-center">
                    <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[12px] tracking-[0] leading-[normal] whitespace-nowrap">
                      {playerData.title}
                    </div>
                    <Badge className="bg-[#00af51] text-white text-[10px]">
                      LVL {playerData.level}
                    </Badge>
                  </div>
                  
                  <Badge className="bg-[#6f30a4] text-white text-[10px] mt-1">
                    {playerData.role}
                  </Badge>
                </div>
              </div>
              
              {/* XP Progress */}
              <div className="flex flex-col items-start gap-[5px] relative self-stretch w-full">
                <div className="flex justify-between items-center relative self-stretch w-full">
                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                    XP
                  </div>
                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                    {playerData.xp}/10000
                  </div>
                </div>
                <Progress 
                  value={(playerData.xp / 10000) * 100} 
                  className="h-2 rounded-full bg-[#ffffff33] border-0" 
                  indicatorClassName="bg-[#00af51]"
                />
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 relative self-stretch w-full mt-2">
                <div className="flex flex-col items-center gap-[2px] p-2 bg-[#ffffff1a] rounded-[10px]">
                  <div className="relative w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal]">
                    {playerData.trophies}
                  </div>
                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                    trophies
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-[2px] p-2 bg-[#ffffff1a] rounded-[10px]">
                  <div className="relative w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal]">
                    {playerData.coins}
                  </div>
                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                    coins
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-[2px] p-2 bg-[#ffffff1a] rounded-[10px]">
                  <div className="relative w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal]">
                    {playerData.medals}
                  </div>
                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
                    medals
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Collection section */}
          <div className="flex flex-col items-start gap-[13px] relative self-stretch w-full">
            <div className="relative w-fit [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-[normal] whitespace-nowrap">
              collection
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative self-stretch w-full">
              {collectionItems.map((item, index) => (
                <Card 
                  key={index}
                  className="flex flex-col items-center gap-[5px] p-3 relative rounded-[14px] overflow-hidden border-0"
                  style={{ backgroundColor: item.rarityColor }}
                >
                  <CardContent className="flex flex-col items-center gap-[5px] p-0 relative self-stretch w-full">
                    <img
                      className="w-full h-[120px] object-cover rounded-[10px]"
                      alt={item.name}
                      src={item.image}
                    />
                    
                    <div className={`relative w-fit [font-family:'Good_Times-Regular',Helvetica] font-normal ${item.textColor} text-sm tracking-[0] leading-[normal] whitespace-nowrap`}>
                      {item.name}
                    </div>
                    
                    <div className={`relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light ${item.textColor} text-[10px] tracking-[0] leading-[normal] whitespace-nowrap`}>
                      {item.rarity}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
