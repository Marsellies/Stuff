import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../store/api/apiSlice';
import styles from '../../styles/Category.module.css';
import Products from '../Products/Products';
import { useSelector } from 'react-redux';

const Category = () => {
  const { id } = useParams();
  const { list } = useSelector(({ categories }) => categories);
  const defaultValues = {
    title: '',
    price_min: 0,
    price_max: 0,
  };
  const defaultParams = {
    categoryId: id,
    limit: 5,
    offset: 0,
    ...defaultValues,
  };
  const [cat, setCat] = useState(null);
  const [isEnd, setIsEnd] = useState(false);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState(defaultValues);
  const [params, setParams] = useState(defaultParams);
  const { data = [], isLoading, isSucces } = useGetProductsQuery(params);
  useEffect(() => {
    if (!id) return;
    setItems([]);
    setIsEnd(false);
    setValues(defaultValues);
    setParams({ ...defaultParams, categoryId: id });
  }, [id]);
  useEffect(() => {
    if (isLoading) return;
    if (!data.length) return setIsEnd(true);
    setItems((_items) => [..._items, ...data]);
  }, [data, isLoading]);
  useEffect(() => {
    if (!id || !list.length) return;
    const category = list.find((item) => item.id === id * 1);
    setCat(category);
  }, [list, id]);
  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setItems([]);
    setIsEnd(false);
    setParams({ ...defaultParams, ...values });
  };
  const handleReset = () => {
    setValues(defaultValues);
    setParams(defaultParams);
    setIsEnd(false);
  };
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{cat?.name}</h2>
      <form className={styles.filters} onSubmit={handleSubmit}>
        <div className={styles.filter}>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            placeholder="Product name"
            value={values.title}
          />
        </div>
        <div className={styles.filter}>
          <input
            type="number"
            name="price_min"
            onChange={handleChange}
            placeholder="0"
            value={values.price_min}
          />
          <span>Price form</span>
        </div>
        <div className={styles.filter}>
          <input
            type="number"
            name="price_max"
            onChange={handleChange}
            placeholder="0"
            value={values.max}
          />
          <span>Price to</span>
        </div>
        <button type="submit" hidden />
      </form>
      {isLoading ? (
        <div className="preloader">Loading...</div>
      ) : !isSucces || !items.length ? (
        <div className={styles.back}>
          <span>No results</span>
          <button onClick={handleReset}>Reset</button>
        </div>
      ) : (
        <Products
          title=""
          products={items}
          style={{ padding: 0 }}
          amount={items.length}
        />
      )}
      {!isEnd && (
        <div className={styles.more}>
          <button
            onClick={() =>
              setParams({ ...params, offset: params.offset + params.limit })
            }
          >
            See more
          </button>
        </div>
      )}
    </section>
  );
};

export default Category;
