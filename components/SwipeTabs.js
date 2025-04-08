// SwipeTabs.js
import * as React from "react";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

// Импортируй свои экраны
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import SellScreen from "./screens/SellScreen";
import MessagesScreen from "./screens/MessagesScreen";
import ProfileScreen from "./screens/ProfileScreen";

const renderScene = SceneMap({
  home: HomeScreen,
  search: SearchScreen,
  sell: SellScreen,
  messages: MessagesScreen,
  profile: ProfileScreen,
});

const SwipeTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Главная" },
    { key: "search", title: "Поиск" },
    { key: "sell", title: "Продать" },
    { key: "messages", title: "Сообщения" },
    { key: "profile", title: "Профиль" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      swipeEnabled={true}
      renderTabBar={() => null} // скрываем табы сверху
    />
  );
};

export default SwipeTabs;
