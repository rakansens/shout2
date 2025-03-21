import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { PointsDisplay } from "../../components/ui/points-display";

export interface CarouselItem {
  id: string | number;
  title: string;
  description: string;
  points: string;
  backgroundImage: string;
  badgeType: string;
}

interface EventCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export function EventCarousel({ items, autoPlayInterval = 4000 }: EventCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, items.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, items.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, currentSlide]);
  
  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-[14px] relative w-full">
        <div 
          ref={carouselRef}
          className="flex transition-all duration-600 ease-in-out will-change-transform"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
          }}
        >
          {items.map((slide, i) => (
            <Card 
              key={slide.id}
              className={`flex-shrink-0 w-full flex flex-col items-center gap-[46px] relative self-stretch overflow-hidden border-0 transition-all duration-600 rounded-[14px]`}
              style={{ 
                backgroundImage: `url(${slide.backgroundImage})`, 
                backgroundSize: 'cover', 
                backgroundPosition: '50% 50%',
                filter: i === currentSlide ? 'brightness(1)' : 'brightness(0.8)',
                transform: `scale(${i === currentSlide ? '1' : '0.95'})`,
                transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            >
              <div 
                className="flex items-center justify-end gap-1.5 relative self-stretch w-full flex-[0_0_auto] overflow-hidden"
              >
                <PointsDisplay 
                  points={slide.points} 
                  frameStyle="rounded-bl"
                />
              </div>

              <div 
                className="w-fit [text-shadow:4px_3px_3px_#000000b2] [font-family:'Good_Times-Regular',Helvetica] font-normal text-white text-[38px] tracking-[0] leading-normal transition-all duration-1000"
                style={{
                  transform: i === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                  opacity: i === currentSlide ? 1 : 0,
                  transitionDelay: '0.4s',
                  transitionDuration: '1s',
                }}
              >
                {slide.title}
              </div>

              <CardContent 
                className="flex flex-col items-center justify-end relative self-stretch w-full flex-[0_0_auto] bg-[#00000080] p-0 mt-auto transition-all duration-1000"
                style={{
                  transform: i === currentSlide ? 'translateY(0)' : 'translateY(30px)',
                  opacity: i === currentSlide ? 1 : 0,
                  transitionDelay: '0.4s',
                  transitionDuration: '1s',
                }}
              >
                <div className="flex flex-col items-center justify-end px-[13px] py-3 relative self-stretch w-full">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[0] leading-normal">
                    {slide.description}
                  </div>
                </div>
              </CardContent>

              <Badge 
                className="inline-flex items-center justify-center gap-2.5 px-3 py-[5px] absolute top-0 left-0 bg-[#ff0000] rotate-[0.00deg] rounded-none rounded-br-[14px] transition-all duration-1000"
                style={{
                  transform: i === currentSlide ? 'translateX(0)' : 'translateX(-100%)',
                  opacity: i === currentSlide ? 1 : 0,
                  transitionDelay: '0.8s',
                  transitionDuration: '1s',
                }}
              >
                <div className="w-fit mt-[-1.00px] [font-family:'Good_Times-Heavy',Helvetica] font-normal text-white text-xs tracking-[0] leading-normal whitespace-nowrap">
                  {slide.badgeType}
                </div>
              </Badge>
            </Card>
          ))}
        </div>
        
        {/* Carousel Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all z-10 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all z-10 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === i 
                  ? "bg-white w-8 h-2" 
                  : "bg-white bg-opacity-50 w-2 h-2 hover:bg-opacity-70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
