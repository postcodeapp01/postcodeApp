import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import Header from "../components/Notifications/Header";
import TabSwitcher from "../components/Notifications/TabSwitcher";
import EmptyNotificationsView from "../components/Notifications/EmptyNotificationsView";
import NotificationItem from "../components/Notifications/NotificationItem";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "offer" | "order";
}

const NotificationsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"offers" | "orders">("offers");

  const notifications: Notification[] = [
    {
      id: "1",
      title: "Flash Sale Alert! 🔥",
      message: "Up to 70% off on summer collection. Limited time offer!",
      time: "2 hours ago",
      isRead: false,
      type: "offer",
    },
    {
      id: "2",
      title: "Exclusive Deal for You",
      message: "Get extra 20% off on your favorite brands with code SAVE20",
      time: "5 hours ago",
      isRead: true,
      type: "offer",
    },
    {
      id: "3",
      title: "Order Shipped",
      message: "Your order #1T000860587 has been shipped and is on the way!",
      time: "1 day ago",
      isRead: false,
      type: "order",
    },
    {
      id: "4",
      title: "Order Delivered",
      message: "Your order #1T000860586 has been successfully delivered.",
      time: "2 days ago",
      isRead: true,
      type: "order",
    },
  ];

  const filteredNotifications = notifications.filter(
    (n) => n.type === (activeTab === "offers" ? "offer" : "order")
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <Header />
      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <EmptyNotificationsView activeTab={activeTab} />
        ) : (
          <View style={{ paddingVertical: 8 }}>
            {filteredNotifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
