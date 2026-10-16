import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

const PRODUCTS = [
  { id: 1, name: 'Kopi Susu', price: 15000 },
  { id: 2, name: 'Teh Manis', price: 10000 },
  { id: 3, name: 'Roti Bakar', price: 12000 },
  { id: 4, name: 'Susu Coklat', price: 18000 },
  { id: 5, name: 'Mie Instan', price: 8000 },
];

const VALID_USER = 'kasir';
const VALID_PASS = '123456';

// Format manual (tanpa toLocaleString) supaya hasilnya konsisten di semua device.
// Contoh: 15000 -> "Rp 15.000"
const rupiah = (n) => 'Rp ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Helper: testID (jadi resource-id di Android) + accessibilityLabel (jadi content-desc)
const tid = (id) => ({ testID: id, accessibilityLabel: id });

export default function App() {
  const [screen, setScreen] = useState('login');
  const [cart, setCart] = useState({}); // { productId: qty }
  const [history, setHistory] = useState([]);

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // checkout
  const [bayar, setBayar] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [receipt, setReceipt] = useState(null);

  const cartItems = PRODUCTS.filter((p) => cart[p.id] > 0).map((p) => ({
    ...p,
    qty: cart[p.id],
    subtotal: p.price * cart[p.id],
  }));
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const total = cartItems.reduce((s, i) => s + i.subtotal, 0);

  const doLogin = () => {
    if (username === VALID_USER && password === VALID_PASS) {
      setLoginError('');
      setScreen('products');
    } else {
      setLoginError('Username atau password salah');
    }
  };

  const logout = () => {
    setUsername('');
    setPassword('');
    setCart({});
    setBayar('');
    setCheckoutError('');
    setReceipt(null);
    setScreen('login');
  };

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const plus = (id) => addToCart(id);
  const minus = (id) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max((c[id] || 0) - 1, 0) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  const removeItem = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const checkout = () => {
    setReceipt(null);
    if (cartItems.length === 0) {
      setCheckoutError('Keranjang kosong');
      return;
    }
    const paid = parseInt(bayar || '0', 10);
    if (isNaN(paid) || paid < total) {
      setCheckoutError('Uang kurang');
      return;
    }
    const change = paid - total;
    const trx = {
      id: history.length + 1,
      total,
      paid,
      change,
      items: totalQty,
    };
    setHistory((h) => [trx, ...h]);
    setReceipt(trx);
    setCart({});
    setBayar('');
    setCheckoutError('');
  };

  const goCart = () => {
    setCheckoutError('');
    setScreen('cart');
  };

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title} {...tid('text_title_login')}>
            Mini POS
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            {...tid('input_username')}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            {...tid('input_password')}
          />
          {loginError ? (
            <Text style={styles.error} {...tid('text_login_error')}>
              {loginError}
            </Text>
          ) : null}
          <TouchableOpacity style={styles.btn} onPress={doLogin} {...tid('btn_login')}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'products') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} {...tid('text_title_products')}>
            Daftar Produk
          </Text>
          <TouchableOpacity onPress={logout} {...tid('btn_logout')}>
            <Text style={styles.link}>Logout</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={PRODUCTS}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} {...tid(`product_name_${item.id}`)}>
                  {item.name}
                </Text>
                <Text style={styles.price} {...tid(`product_price_${item.id}`)}>
                  {rupiah(item.price)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.btnSmall}
                onPress={() => addToCart(item.id)}
                {...tid(`btn_add_${item.id}`)}
              >
                <Text style={styles.btnText}>Tambah</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setScreen('history')} {...tid('btn_history')}>
            <Text style={styles.link}>Riwayat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={goCart} {...tid('btn_open_cart')}>
            <Text style={styles.btnText}>
              Keranjang (<Text {...tid('badge_cart')}>{totalQty}</Text>)
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'cart') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('products')} {...tid('btn_back')}>
            <Text style={styles.link}>{'< Kembali'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} {...tid('text_title_cart')}>
            Keranjang
          </Text>
          <View style={{ width: 70 }} />
        </View>

        <View style={{ flex: 1, padding: 16 }}>
          {cartItems.length === 0 ? (
            <Text style={styles.muted} {...tid('text_empty_cart')}>
              Keranjang kosong
            </Text>
          ) : (
            cartItems.map((i) => (
              <View key={i.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{i.name}</Text>
                  <Text style={styles.price} {...tid(`subtotal_${i.id}`)}>
                    {rupiah(i.subtotal)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => minus(i.id)}
                  {...tid(`btn_minus_${i.id}`)}
                >
                  <Text style={styles.btnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qty} {...tid(`qty_${i.id}`)}>
                  {i.qty}
                </Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => plus(i.id)}
                  {...tid(`btn_plus_${i.id}`)}
                >
                  <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: '#d9534f', marginLeft: 8 }]}
                  onPress={() => removeItem(i.id)}
                  {...tid(`btn_remove_${i.id}`)}
                >
                  <Text style={styles.btnText}>x</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <Text style={styles.total} {...tid('text_total')}>
            {rupiah(total)}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Uang bayar (angka)"
            keyboardType="numeric"
            value={bayar}
            onChangeText={(t) => setBayar(t.replace(/[^0-9]/g, ''))}
            {...tid('input_bayar')}
          />

          {checkoutError ? (
            <Text style={styles.error} {...tid('text_checkout_error')}>
              {checkoutError}
            </Text>
          ) : null}

          {receipt ? (
            <View>
              <Text style={styles.success} {...tid('text_success')}>
                Transaksi berhasil
              </Text>
              <Text style={styles.success} {...tid('text_kembalian')}>
                {rupiah(receipt.change)}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.btn} onPress={checkout} {...tid('btn_checkout')}>
            <Text style={styles.btnText}>Bayar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // history
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('products')} {...tid('btn_back')}>
          <Text style={styles.link}>{'< Kembali'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} {...tid('text_title_history')}>
          Riwayat
        </Text>
        <View style={{ width: 70 }} />
      </View>
      <View style={{ padding: 16 }}>
        {history.length === 0 ? (
          <Text style={styles.muted} {...tid('text_empty_history')}>
            Belum ada transaksi
          </Text>
        ) : (
          history.map((h, idx) => (
            <View key={h.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Transaksi #{h.id}</Text>
                <Text style={styles.muted}>{h.items} item</Text>
              </View>
              <Text style={styles.price} {...tid(`history_total_${idx}`)}>
                {rupiah(h.total)}
              </Text>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  center: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#2f6fed',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSmall: {
    backgroundColor: '#2f6fed',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  qtyBtn: {
    backgroundColor: '#2f6fed',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { marginHorizontal: 10, fontSize: 18, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  link: { color: '#2f6fed', fontSize: 16, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 17, fontWeight: '600' },
  price: { fontSize: 15, color: '#444', marginTop: 2 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  total: { fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
  error: { color: '#d9534f', marginBottom: 12, fontSize: 15 },
  success: { color: '#2e8b57', marginBottom: 6, fontSize: 16, fontWeight: '600' },
  muted: { color: '#777', fontSize: 15 },
});
