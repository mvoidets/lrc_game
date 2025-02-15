import React, {
  useRef,
  useEffect,
  ReactNode,
  useState,
  useCallback,
} from "react";

interface ScrollContainerProps {
  children: ReactNode;
}

export const ScrollContainer = ({ children }: ScrollContainerProps) => {
  const outerDiv = useRef<HTMLDivElement | null>(null);
  const innerDiv = useRef<HTMLDivElement | null>(null);

  const prevInnerDivHeight = useRef<number | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (outerDiv.current) {
        const { scrollTop, scrollHeight, clientHeight } = outerDiv.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        setShowScrollButton(!isAtBottom);
      }
    };

    if (outerDiv.current) {
      outerDiv.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial position
    }

    return () => {
      outerDiv.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (outerDiv.current && innerDiv.current) {
      const outerDivHeight = outerDiv.current.clientHeight;
      const innerDivHeight = innerDiv.current.clientHeight;
      const scrollTop = outerDiv.current.scrollTop;

      const isAtBottom = scrollTop + outerDivHeight >= innerDivHeight - 5;

      if (!prevInnerDivHeight.current || isAtBottom) {
        outerDiv.current.scrollTo({
          top: innerDivHeight - outerDivHeight,
          left: 0,
          behavior: prevInnerDivHeight.current ? "smooth" : "auto",
        });
      } else {
        setShowScrollButton(true);
      }

      prevInnerDivHeight.current = innerDivHeight;
    }
  }, [children]);

  const handleScrollButtonClick = useCallback(() => {
    if (outerDiv.current && innerDiv.current) {
      const outerDivHeight = outerDiv.current.clientHeight;
      const innerDivHeight = innerDiv.current.clientHeight;

      outerDiv.current.scrollTo({
        top: innerDivHeight - outerDivHeight,
        left: 0,
        behavior: "smooth",
      });

      setShowScrollButton(false);
    }
  }, []);

  return (
    <div className="relative h-64 max-h-64 w-full overflow-hidden border border-gray-700 rounded-lg">
      <div ref={outerDiv} className="relative h-full overflow-y-auto p-2">
        <div ref={innerDiv}>{children}</div>
      </div>
      {showScrollButton && (
        <button
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md transition-opacity duration-300 opacity-100"
          onClick={handleScrollButtonClick}
        >
          New message!
        </button>
      )}
    </div>
  );
};
