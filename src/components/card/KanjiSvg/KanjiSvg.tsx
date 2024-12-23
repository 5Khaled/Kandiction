import { useCallback, useEffect, useRef, useState } from "react";

import MainSVG from "./MainSVG";
import PlaceHolderSVG from "./PlaceHolderSVG.tsx";
import Options from "./Options.tsx";

import Loader from "../../../assets/QuantumLoader";

export default function KanjiSvg({ KANJI }: { KANJI: string | undefined }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const SvgHolder = useRef<HTMLDivElement | null>(null);

  const [svgContent, setSvgContent] = useState<string | null>(null);

  const [strokeOrderToggled, setStrokeOrderToggled] = useState(false);
  const manualToggleRef = useRef(false); // Tracks manual toggle state
  const [isAnimating, setIsAnimating] = useState(false);
  const SVG_SOURCE = `https://kanji.vwh.sh/svg/${KANJI?.codePointAt(0)
    ?.toString(16)
    .padStart(5, "0")}.svg`;

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);

    // Fetch the SVG file
    const fetchSvg = async () => {
      try {
        const response = await fetch(SVG_SOURCE);
        const svgText = await response.text();

        // Extract the <svg> content using a regular expression
        const svgOnly = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[0];

        if (svgOnly) {
          setSvgContent(svgOnly);
        } else {
          console.error("SVG content not found");
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
      setIsLoading(false);
    };
    fetchSvg();
  }, [SVG_SOURCE]);

  const timeoutIdsRef = useRef<number[]>([]); // Store timeout IDs here

  const playAnimation = useCallback(() => {
    const SVG = SvgHolder.current?.querySelector("svg");
    setIsAnimating(true);
    if (SVG) {
      const paths = SVG.querySelectorAll("path");
      const texts = SVG.querySelectorAll("text");

      paths.forEach((path, index) => {
        path.style.transition = "initial";
        texts[index].style.display = "none";
      });
      const strokeDuration = 0.4; // (Seconds)
      const animationDelay = 1000; // MS

      // Animate each stroke
      paths.forEach((path, index) => {
        path.style.strokeDashoffset = `${path.getTotalLength()}`;
        path.style.strokeDasharray = `${path.getTotalLength()}`;
        const timeoutId = setTimeout(() => {
          path.style.transition = `stroke-dashoffset ${strokeDuration}s ease ${
            index * strokeDuration
          }s`;
          path.style.strokeDashoffset = `${0}`;
        }, animationDelay);
        timeoutIdsRef.current.push(timeoutId); // Store timeout ID
      });

      // Show Stroke order number while each stroke is being animated
      texts.forEach((text, index) => {
        const timeoutId = setTimeout(
          () => {
            text.style.display = "block";
          },
          animationDelay + strokeDuration * animationDelay * index
        );
        timeoutIdsRef.current.push(timeoutId); // Store timeout ID
      });

      // Hide Stroke order numbers after animation finishes
      const endAnimationTimeoutId = setTimeout(
        () => {
          if (!manualToggleRef.current) {
            texts.forEach((text) => {
              text.style.display = "none";
            });
          }
          setIsAnimating(false);
        },
        animationDelay + strokeDuration * animationDelay * paths.length
      );
      timeoutIdsRef.current.push(endAnimationTimeoutId); // Store final timeout ID
    }
  }, []);

  const cancelAnimation = useCallback(() => {
    const SVG = SvgHolder.current?.querySelector("svg");
    if (SVG) {
      const paths = SVG.querySelectorAll("path");
      const texts = SVG.querySelectorAll("text");

      paths.forEach((path) => {
        path.style.transition = "none";
        path.style.strokeDashoffset = `${0}`;
      });

      if (manualToggleRef.current) {
        texts.forEach((text) => {
          text.style.display = "block";
        });
      } else {
        texts.forEach((text) => {
          text.style.display = "none";
        });
      }

      // Clear all timeouts
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current = []; // Reset timeout IDs array
      setIsAnimating(false);
    }
  }, []);

  return (
    <div className="group relative p-3 size-52 aspect-square max-sm:size-40 max-2xs:size-full shrink-0 rounded border-2 bg-black bg-opacity-35 dark:bg-opacity-25 flex items-center justify-center">
      {isLoading && <Loader />}
      {isError && !isLoading && <NoSVG KANJI={KANJI} />}
      {!isLoading && !isError && (
        <>
          <Options
            playAnimation={playAnimation}
            cancelAnimation={cancelAnimation}
            isAnimating={isAnimating}
            SvgHolder={SvgHolder}
            strokeOrderToggled={strokeOrderToggled}
            setStrokeOrderToggled={setStrokeOrderToggled}
            manualToggleRef={manualToggleRef}
          />
          <figure className="relative size-full flex items-center justify-center [&>*]:size-full">
            <MainSVG
              SvgHolder={SvgHolder}
              svgContent={svgContent}
              playAnimation={playAnimation}
              cancelAnimation={cancelAnimation}
            />
            <PlaceHolderSVG svgContent={svgContent} />
          </figure>
        </>
      )}
    </div>
  );
}

function NoSVG({ KANJI }: { KANJI: string | undefined }) {
  return (
    <figure className="[container-type:inline-size] size-full flex flex-col justify-around items-center">
      <span className="text-[40cqi] leading-none text-white">{KANJI}</span>
      <span className="text-white text-opacity-50 text-[8cqi]">
        No SVG available!
      </span>
    </figure>
  );
}
