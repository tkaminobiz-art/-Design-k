import { useState, useCallback } from "react";
import { ArchitecturalGrid } from "./components/ui/ArchitecturalGrid";
import { DigitalFlowBackground } from "./components/ui/DigitalFlowBackground";
import ContentLayer from "./components/ui/ContentLayer";
import { OpeningSequence } from "./components/ui/OpeningSequence";
import { type KeywordDetail, KEYWORD_DATA } from "./lib/constants";

function App() {
  const [selectedDetail, setSelectedDetail] = useState<KeywordDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleKeywordSelect = useCallback((keyword: string) => {
    // ... existing logic
    const detail = KEYWORD_DATA[keyword];
    if (detail) {
      setSelectedDetail(detail);
    } else {
      setSelectedDetail({
        role: "UNKNOWN DATA",
        context: keyword,
        description: "No detailed record found in the local database.",
      });
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* OPENING SEQUENCE (Z-50) */}
      {isLoading && <OpeningSequence onComplete={() => setIsLoading(false)} />}

      {/* Background Layer 1: Modern Digital Fluid (Z-0) */}
      <DigitalFlowBackground />

      {/* Background Layer 2: Architectural Grid (Z-1) */}
      <div className="relative z-[1]">
        <ArchitecturalGrid />
      </div>

      {/* Foreground Layer: Content / Order (Z-10) */}
      <div className="relative z-[10]">
        <ContentLayer selectedDetail={selectedDetail} onSelect={handleKeywordSelect} />
      </div>
    </div>
  );
}

export default App;
