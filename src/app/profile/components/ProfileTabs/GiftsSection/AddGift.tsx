'use client';

import { useState, useMemo } from 'react'
import styles from '../../../page.module.css'
import { createGift } from '@/actions/gift-actions'
import gift from '@/data/gift.json'
import Image from "next/image"

export default function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [selectedBackdrop, setSelectedBackdrop] = useState('')
  const [price, setPrice] = useState<string | number>(0)

  const handleClose = () => {
    setIsOpen(false)
    setSelectedCollection('')
    setSelectedModel('')
    setSelectedSymbol('')
    setSelectedBackdrop('')
    setPrice(0)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setPrice("");
      return;
    }

    const numVal = Number(val);

    if (numVal > 10000000) {
      setPrice(10000000);
    } else if (numVal < 0) {
      setPrice(0);
    } else {
      setPrice(val);
    }
  };

  const availableModels = useMemo(() => {
    if (!selectedCollection) return []
    const col = gift.collections.find(c => c.id === selectedCollection)
    return col?.models || []
  }, [selectedCollection])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      await createGift(data)
      setIsOpen(false)
      setSelectedCollection('')
      setSelectedModel('')
      setSelectedSymbol('')
      setSelectedBackdrop('');
      (event.target as HTMLFormElement).reset()
      window.location.reload()
    } catch (error) {
      alert('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  const getImage = (id: string, collection?: string) => {
    let result = id;

    const exceptions: Record<string, string> = {
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
      } else if (id.endsWith('ies')) {
        result = id.replace(/ies$/, 'y');
      } else if (id.endsWith('s')) {
        result = id.slice(0, -1);
      }
    }

    return `/gift/collections/${collection || id}/${result}.webp`;
  }

  return (
    <>
      <button className={styles.addBtn} onClick={() => setIsOpen(true)}>
        + Добавить товар
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Новый товар</h2>
              <button className={styles.modalClose} onClick={handleClose}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Коллекция</label>
                  <div className={styles.selectWithImage}>
                    {selectedCollection && (
                      <Image
                        src={getImage(selectedCollection)}
                        alt={selectedCollection}
                        width={20}
                        height={20}
                        className={styles.selectCollectionImage}
                      />
                    )}
                    <select
                      name="collection"
                      className={styles.formInput}
                      required
                      value={selectedCollection}
                      onChange={(e) => {
                        setSelectedCollection(e.target.value)
                        setSelectedModel('')
                      }}
                    >
                      <option value="" disabled>Выберите коллекцию</option>
                      {gift.collections.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Модель</label>
                  <div className={styles.selectWithImage}>
                    {selectedModel && selectedCollection && (
                      <Image
                        src={getImage(selectedModel, selectedCollection)}
                        alt={selectedModel}
                        width={20}
                        height={20}
                        className={styles.selectModelImage}
                      />
                    )}
                    <select
                      name="model"
                      className={styles.formInput}
                      required
                      disabled={!selectedCollection}
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option value="" disabled>
                        {!selectedCollection ? 'Сначала выберите коллекцию' : 'Выберите модель'}
                      </option>
                      {availableModels.map((model) => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.rowGroup}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Символ</label>
                    <div className={styles.selectWithImage}>
                      {selectedSymbol && (
                        <Image
                          src={`/gift/symbols/${selectedSymbol}/${selectedSymbol}.webp`}
                          alt={selectedSymbol}
                          width={20}
                          height={20}
                          className={styles.selectSymbolImage}
                        />
                      )}
                      <select
                        name="symbol"
                        className={styles.formInput}
                        required
                        value={selectedSymbol}
                        onChange={(e) => setSelectedSymbol(e.target.value)}
                      >
                        <option value="" disabled>Выберите символ</option>
                        {gift.symbols.map((sym) => (
                          <option key={sym.id} value={sym.id}>{sym.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Цена (RUB)</label>
                    <input
                      name="price"
                      type="number"
                      value={price}
                      onChange={handlePriceChange}
                      step="50"
                      className={`${styles.formInput} select-none`}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Фон (Backdrop)</label>
                  <div className={styles.selectWithImage}>
                    {selectedBackdrop && (
                      <Image
                        src={`/gift/backdrops/${selectedBackdrop}/${selectedBackdrop}.svg`}
                        alt={selectedBackdrop}
                        width={20}
                        height={20}
                        className={styles.selectBackdropImage}
                      />
                    )}
                    <select
                      name="backdrop"
                      className={styles.formInput}
                      required
                      value={selectedBackdrop}
                      onChange={(e) => setSelectedBackdrop(e.target.value)}
                    >
                      <option value="" disabled>Выберите фон</option>
                      {gift.backdrops.map((bd) => (
                        <option key={bd.id} value={bd.id}>{bd.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Описание</label>
                  <textarea name="description" className={styles.formTextarea} rows={3} placeholder="Расскажите о предмете..." required />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={handleClose}>
                  Отмена
                </button>
                <button type="submit" className={styles.saveBtn} disabled={loading}>
                  {loading ? 'Сохранение...' : 'Опубликовать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}