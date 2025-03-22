import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";

export const WeeklyRankSection = (): JSX.Element => {
  return (
    <Card className="flex items-center gap-3.5 px-4 py-2 w-full bg-[#00000080] rounded-[47px] opacity-[0.99] border-none">
      <Avatar className="w-[42px] h-[42px] bg-[#d9d9d9] rounded-[21px]">
        <AvatarFallback className="bg-[#d9d9d9]"></AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start gap-[5px] justify-center">
        <div className="[font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-normal whitespace-nowrap">
          RHYTHM MASTER
        </div>

        <div className="[font-family:'Good_Times-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-normal whitespace-nowrap">
          player123
        </div>
      </div>

      <Badge className="flex-1 px-2.5 py-0 bg-[#475cff] rounded-[90px] h-8 flex items-center justify-center">
        <span className="[font-family:'Good_Times-Light',Helvetica] font-light text-white text-sm text-center tracking-[0] leading-normal">
          This is a test song
        </span>
      </Badge>

      <div className="flex w-[57px] h-[35px] items-center justify-center gap-2.5">
        <div className="[font-family:'Good_Times-Heavy',Helvetica] font-normal text-[#fffdfd] text-lg text-center tracking-[0] leading-normal">
          4
        </div>
      </div>
    </Card>
  );
};
