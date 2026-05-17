import Image from "next/image";
import styles from "./GiftImage.module.css";

interface GiftImageProps {
  gift: {
    backdrop: string;
    symbol: string;
    collection: string;
    modelName: string;
  };
  size?: number;
}

export const GiftImage = ({ gift, size = 300 }: GiftImageProps) => {
  const symbols = Array(20).fill(0);
  const isSmall = size < 200;

  return (
    <div 
      className={styles.giftImageWrapper} 
      style={{ 
        width: size, 
        height: isSmall ? size : 220 
      }}
    >
      <Image 
        src={`/gift/backdrop/${gift.backdrop.replaceAll(" ", "")}.svg`} 
        alt="backdrop" 
        fill 
        className={styles.backdropImage} 
      />
      {symbols.map((_, index) => (
        <Image
          key={index}
          src={`/gift/symbol/${gift.symbol.replaceAll(" ", "")}.png`}
          alt="symbol"
          width={isSmall ? 4 : 8}
          height={isSmall ? 4 : 8}
          className={`${styles.symbolImage} ${styles[`symbol${index + 1}`]}`}
        />
      ))}
      <Image 
        src={`/gift/collection/model/${gift.collection.replaceAll(" ", "")}/${gift.modelName.replaceAll(" ", "")}.png`} 
        alt="model" 
        width={size * 0.8}
        height={size * 0.8} 
        className={styles.modelImage} 
      />
    </div>
  );
};
