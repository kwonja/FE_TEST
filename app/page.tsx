import { GameClickTrackingArea } from "@/features/game-analytics/client/game-click-tracking-area";
import { GameHub } from "@/features/game-hub/components/game-hub";

const Home = () => {
  return (
    <GameClickTrackingArea>
      <GameHub />
    </GameClickTrackingArea>
  );
};

export default Home;
