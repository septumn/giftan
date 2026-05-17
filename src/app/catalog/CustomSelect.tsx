'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import gift from '../../data/gift.json';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CatalogSidebar() {
  const [searchCollection, setSearchCollection] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');
  const [searchBackdrop, setSearchBackdrop] = useState('');

  const [openCollections, setOpenCollections] = useState(true);
  const [openModels, setOpenModels] = useState(true);
  const [openSymbols, setOpenSymbols] = useState(true);
  const [openBackdrops, setOpenBackdrops] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const collections = gift.collections;
  const collection = collections.find(collection => collection.id === searchParams.get('collection'));
  const models = collection?.models || [];
  const symbols = gift.symbols;
  const backdrops = gift.backdrops;

  const handleFilterChange = (category: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(category) === value) {
      params.delete(category);
    } else {
      params.set(category, value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getImage = (id, collection?) => {
    let result = id;  

    const exceptions = {
      berryBoxes: 'berryBox',
      bowTies: 'bowTie',
      gingerCookies: 'gingerCookie',
      happyBrownies: 'happyBrownie',
      jacksInTheBox: 'jackInTheBox',
      jingleBells: 'jingleBells',
      preciousPeaches: 'preciousPeach',
      skyStilettos: 'skyStilettos',
      snakeBoxes: 'snakeBox',
      snowMittens: 'snowMittens',
      swissWatches: 'swissWatch',
      valentineBoxes: 'valentineBox',
      freshSocks: 'freshSocks'
    };

    if (!collection) {
      if (exceptions[id]) {
        result = exceptions[id];
      }
      else if (id.endsWith('ies')) {
        result = id.replace(/ies$/, 'y');
      }
      else if (id.endsWith('s')) {
        result = id.slice(0, -1);
      }
    }

    return `/gift/collections/${collection || id}/${result}.webp`;
  };

  const filterItems = (items, query) => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) return items;

    return items.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  };

  const filteredCollections = filterItems(collections, searchCollection);

  const filteredModels = filterItems(models, searchModel);

  const filteredSymbols = filterItems(symbols, searchSymbol);

  const filteredBackdrops = filterItems(backdrops, searchBackdrop);

  return (
    <div>
      <div className={styles.filterGroup}>
        <div className={styles.accordionHeader}>
          <h3 className={styles.filterTitle}>Collection</h3>
          <div className={styles.headerRight}>
            <span className={styles.totalBadge}>{collections.length}</span>
            <span onClick={() => setOpenCollections(!openCollections)} className={`${styles.chevron} ${openCollections ? 'rotate-180' : ''}`}>▲</span>
          </div>
        </div>

        <div className={styles.accordionContent}>
          <div className='relative'>
            <input type="text" value={searchCollection} onChange={(e) => setSearchCollection(e.target.value)} className={styles.searchInput} placeholder="Search collections..." />
            <span onClick={() => setSearchCollection('')} className='fa-solid fa-xmark absolute top-1 right-1 cursor-pointer p-2 hover:text-red-400'></span>
          </div>
          <div className={styles.filterList}>
            {filteredCollections && openCollections && filteredCollections.map((collection) => (
              <label key={collection.id} className={styles.itemRow}>
                <input checked={searchParams.get('collection') === collection.id} onChange={() => handleFilterChange('collection', collection.id)} type="checkbox" />
                <span className={styles.checkboxCustom}></span>
                <Image src={getImage(collection.id)} alt={collection.name} width={20} height={20} className={styles.selectCollectionImage} />
                <span className={styles.itemLabel}>{collection.name}</span>
                <span className={styles.itemCount}>{collection.models.length}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.filterGroup} ${searchParams.get('collection') ? '' : 'pointer-events-none'}`}>
        <div className={styles.accordionHeader}>
          <h3 className={styles.filterTitle}>Model</h3>
          <div className={styles.headerRight}>
            <span className={styles.totalBadge}>{models.length}</span>
            <span onClick={() => setOpenModels(!openModels)} className={`${styles.chevron} ${openModels ? 'rotate-180' : ''}`}>▲</span>
          </div>
        </div>

        <div className={styles.accordionContent}>
          <div className='relative'>
            <input type="text" value={searchModel} onChange={(e) => setSearchModel(e.target.value)} className={styles.searchInput} placeholder="Search collections..." />
            <span onClick={() => setSearchModel('')} className='fa-solid fa-xmark absolute top-1 right-1 cursor-pointer p-2 hover:text-red-400'></span>
          </div>
          <div className={styles.filterList}>
            {filteredModels && openModels && filteredModels.map((model) => (
              <label key={model.id} className={styles.itemRow}>
                <input checked={searchParams.get('model') === model.id} onChange={() => handleFilterChange('model', model.id)} type="checkbox" />
                <span className={styles.checkboxCustom}></span>
                <Image src={getImage(model.id, searchParams.get('collection'))} alt="collection" width={20} height={20} className={styles.selectModelImage} />
                <span className={styles.itemLabel}>{model.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.accordionHeader}>
          <h3 className={styles.filterTitle}>Symbol</h3>
          <div className={styles.headerRight}>
            <span className={styles.totalBadge}>{symbols.length}</span>
            <span onClick={() => setOpenSymbols(!openSymbols)} className={`${styles.chevron} ${openSymbols ? 'rotate-180' : ''}`}>▲</span>
          </div>
        </div>

        <div className={styles.accordionContent}>
          <div className='relative'>
            <input type="text" value={searchSymbol} onChange={(e) => setSearchSymbol(e.target.value)} className={styles.searchInput} placeholder="Search collections..." />
            <span onClick={() => setSearchSymbol('')} className='fa-solid fa-xmark absolute top-1 right-1 cursor-pointer p-2 hover:text-red-400'></span>
          </div>
          <div className={styles.filterList}>
            {filteredSymbols && openSymbols && filteredSymbols.map((symbol) => (
              <label key={symbol.id} className={styles.itemRow}>
                <input checked={searchParams.get('symbol') === symbol.id} onChange={() => handleFilterChange('symbol', symbol.id)} type="checkbox" />
                <span className={styles.checkboxCustom}></span>
                <Image src={`/gift/symbols/${symbol.id}/${symbol.id}.webp`} alt="collection" width={20} height={20} className={styles.selectSymbolImage} />
                <span className={styles.itemLabel}>{symbol.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.accordionHeader}>
          <h3 className={styles.filterTitle}>Backdrop</h3>
          <div className={styles.headerRight}>
            <span className={styles.totalBadge}>{backdrops.length}</span>
            <span onClick={() => setOpenBackdrops(!openBackdrops)} className={`${styles.chevron} ${openBackdrops ? 'rotate-180' : ''}`}>▲</span>
          </div>
        </div>

        <div className={styles.accordionContent}>
          <div className='relative'>
            <input type="text" value={searchBackdrop} onChange={(e) => setSearchBackdrop(e.target.value)} className={styles.searchInput} placeholder="Search collections..." />
            <span onClick={() => setSearchBackdrop('')} className='fa-solid fa-xmark absolute top-1 right-1 cursor-pointer p-2 hover:text-red-400'></span>
          </div>
          <div className={styles.filterList}>
            {filteredBackdrops && openBackdrops && filteredBackdrops.map((backdrop) => (
              <label key={backdrop.id} className={styles.itemRow}>
                <input checked={searchParams.get('backdrop') === backdrop.id} onChange={() => handleFilterChange('backdrop', backdrop.id)} type="checkbox" />
                <span className={styles.checkboxCustom}></span>
                <Image src={`/gift/backdrops/${backdrop.id}/${backdrop.id}.svg`} alt="collection" width={20} height={20} className={styles.selectBackdropImage} />
                <span className={styles.itemLabel}>{backdrop.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}