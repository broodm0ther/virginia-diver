import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";

const RefreshableScrollView = ({ onRefresh, children, ...props }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh?.(); // вызывает функцию обновления из родителя
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export default RefreshableScrollView;
