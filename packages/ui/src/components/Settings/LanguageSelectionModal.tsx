import React from "react";
import { CheckIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "../ui/dialog";
import { Button } from "../ui/button";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const languages = [
  { code: "english", name: "English" },
  { code: "spanish", name: "Español" },
  { code: "french", name: "Français" },
  { code: "german", name: "Deutsch" },
  { code: "japanese", name: "日本語" },
  { code: "korean", name: "한국어" },
  { code: "chinese", name: "中文" }
];

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onOpenChange,
  currentLanguage,
  onSelectLanguage
}) => {
  const handleSelectLanguage = (language: string) => {
    onSelectLanguage(language);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl tracking-wide [font-family:'Good_Times-Book',Helvetica]">
            Select Language
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              className={`flex justify-between items-center w-full p-4 rounded-lg ${
                currentLanguage === language.code 
                  ? "bg-[#2C2C2E]" 
                  : "hover:bg-[#2C2C2E]"
              }`}
              onClick={() => handleSelectLanguage(language.code)}
            >
              <span className="text-white text-lg">{language.name}</span>
              {currentLanguage === language.code && (
                <CheckIcon className="h-5 w-5 text-white" />
              )}
            </Button>
          ))}
        </div>

        <DialogClose asChild>
          <Button 
            className="w-full bg-[#2C2C2E] hover:bg-[#3C3C3E] text-white [font-family:'Good_Times-Book',Helvetica]"
          >
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionModal;
