import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, loginSuccess, logout } from './features/auth/authSlice';
import { addToCart, addToHistory, clearCart } from './features/shop/shopSlice';
import ProtectedRoute from './components/ProtectedRoute';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !name) return alert('Заповніть усі поля!');
    
    dispatch(registerUser({ name, email, password }));
    alert('Реєстрація успішна! Тепер увійдіть у систему.');
    navigate('/login');
  };

  return (
    <div>
      <h2>Реєстрація</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Створити акаунт</button>
      </form>
      <p>Вже маєте акаунт? <Link to="/login">Увійти</Link></p>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registeredUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      dispatch(loginSuccess(user));
      navigate(from, { replace: true });
    } else {
      alert('Невірний email або пароль! Переконайтеся, що ви зареєструвалися.');
    }
  };

  return (
    <div>
      <h2>Вхід</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Увійти</button>
      </form>
      <p>Немає акаунта? <Link to="/register">Зареєструватися</Link></p>
    </div>
  );
};

const HomePage = () => {
  const { products } = useSelector((state) => state.shop);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBuy = (product) => {
    if (!isAuthenticated) {
      alert('Тільки зареєстровані користувачі можуть купувати товари!');
      navigate('/login');
    } else {
      dispatch(addToCart(product));
      navigate('/checkout');
    }
  };

  return (
    <div>
      <div>
        <h2>Наші товари</h2>
        <p>Для замовлення увійдіть у свій акаунт.</p>
      </div>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <div>
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
            </div>
            <div>
              <div>{product.price} грн</div>
              <button onClick={() => handleBuy(product)}>
                Купити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cart } = useSelector((state) => state.shop);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div>
        <h3>Кошик порожній. Оберіть товар на головній сторінці.</h3>
        <Link to="/">До каталогу</Link>
      </div>
    );
  }

  const item = cart[0]; 

  const handleProcessPayment = () => {
    const wayforpay = new window.Wayforpay();

    wayforpay.run({
        merchantAccount: "test_merch_n1", 
        merchantDomainName: window.location.hostname,
        authorizationType: "SimpleSignature",
        merchantSignature: "", 
        orderReference: `Order_${Date.now()}`,
        orderDate: Math.floor(Date.now() / 1000),
        amount: item.price.toString(),
        currency: "UAH",
        productName: [item.name],
        productPrice: [item.price.toString()],
        productCount: ["1"],
        clientFirstName: user?.name || "Гість",
        clientLastName: "Користувач",
        clientEmail: user?.email || "test@gmail.com",
        clientPhone: "+380990000000",
      },
      function (response) {
        if (response.reasonCode === 1100 || response.transactionStatus === "Approved") {
          alert("Оплата успішна! Товар додано в історію покупок.");
          dispatch(addToHistory({ ...item, orderId: response.orderReference, date: new Date().toLocaleDateString() }));
          navigate('/history'); 
        } else {
          alert(`Помилка оплати: ${response.reason}`);
        }
      },
      function (response) {
        alert("Оплату відхилено. Ви залишаєтесь на цій сторінці для повторної спроби.");
      },
      function (response) {
        console.log("Віджет закритий користувачем");
      }
    );
  };

  return (
    <div>
      <h2>Оформлення замовлення</h2>
      <div>
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
        <div>Сума до сплати: {item.price} грн</div>
      </div>
      <button onClick={handleProcessPayment}>
        Оплатити карткою (WayForPay)
      </button>
    </div>
  );
};

const HistoryPage = () => {
  const { purchaseHistory } = useSelector((state) => state.shop);

  return (
    <div>
      <h2>Історія ваших покупок</h2>
      {purchaseHistory.length === 0 ? (
        <p>У вас ще немає оплачених товарів. Купіть щось цікаве на головній сторінці!</p>
      ) : (
        <div>
          {purchaseHistory.map((item, idx) => (
            <div key={idx}>
              <div>
                <h3>{item.name}</h3>
                <p>Номер замовлення: <strong>{item.orderId}</strong></p>
                <p>Дата оплати: {item.date}</p>
              </div>
              <div>Оплачено {item.price} грн</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <div>
      <header>
        <div>
          <Link to="/">PC Shop</Link>
        </div>
        <nav>
          <Link to="/">Каталог</Link>
          {isAuthenticated ? (
            <>
              <Link to="/history">Історія покупок</Link>
              <span>Привіт, <strong>{user?.name}</strong>!</span>
              <button onClick={handleLogout}>Вийти</button>
            </>
          ) : (
            <>
              <Link to="/login">Вхід</Link>
              <Link to="/register">Реєстрація</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;