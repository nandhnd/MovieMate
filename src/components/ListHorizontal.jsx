import { View, FlatList } from "react-native";
import React, { useState } from "react";
import ItemHorizontal from "./ItemHorizontal";

// Komponen ini menerima props 'data' dari parent
// Menggunakan STATE untuk menyimpan daftar film yang di-bookmark
const ListHorizontal = ({ data }) => {
  // State untuk menyimpan ID film yang di-bookmark
  const [bookmark, setBookmark] = useState([]);

  // Fungsi untuk menambah/menghapus bookmark
  // Props: menerima itemId dari child component
  const toggleBookmark = (itemId) => {
    if (bookmark.includes(itemId)) {
      // Jika sudah di-bookmark, hapus dari array
      setBookmark(bookmark.filter((id) => id !== itemId));
    } else {
      // Jika belum di-bookmark, tambahkan ke array
      setBookmark([...bookmark, itemId]);
    }
  };

  // Fungsi render item untuk FlatList
  // Mengirim props ke komponen anak (ItemHorizontal)
  const renderItem = ({ item }) => {
    const isBookmarked = bookmark.includes(item.id);
    return (
      <ItemHorizontal
        item={item} // Props: data film
        isBookmarked={isBookmarked} // Props: status bookmark
        onPress={() => toggleBookmark(item.id)} // Props: fungsi callback
      />
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      contentContainerStyle={{ paddingHorizontal: 24 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default ListHorizontal;
