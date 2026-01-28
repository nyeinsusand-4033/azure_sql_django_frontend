import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Store, ShoppingBag, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { storeService, productService, orderService, userService } from '../services/api';

const StatCard = ({ title, value, icon: Icon, to, color }) => (
    <Link to={to} className="block group">
        <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-slate-800/50 backdrop-blur-xl">
            <CardContent className="flex items-center justify-between p-6">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-primary transition-colors">{value}</h3>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={24} />
                </div>
            </CardContent>
        </Card>
    </Link>
);

const Dashboard = () => {
    const [counts, setCounts] = useState({ stores: 0, products: 0, orders: 0, users: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [stores, products, orders, users] = await Promise.all([
                    storeService.getAll(),
                    productService.getAll(),
                    orderService.getAll(),
                    userService.getAll()
                ]);

                setCounts({
                    stores: stores.length,
                    products: products.length,
                    orders: orders.length,
                    users: users.length
                });

                // Get last 5 orders for recent activity
                const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setRecentOrders(sortedOrders.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { title: 'Total Stores', value: counts.stores.toString(), icon: Store, to: '/stores', color: 'from-blue-500 to-cyan-500' },
        { title: 'Total Products', value: counts.products.toString(), icon: ShoppingBag, to: '/products', color: 'from-purple-500 to-pink-500' },
        { title: 'Active Orders', value: counts.orders.toString(), icon: ShoppingCart, to: '/orders', color: 'from-orange-500 to-red-500' },
        { title: 'Total Users', value: counts.users.toString(), icon: Users, to: '/users', color: 'from-emerald-500 to-green-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Dashboard Overview</h1>
                <p className="text-slate-400 mt-2">Welcome back to Nexus Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="min-h-[300px] bg-slate-800/30">
                    <CardContent>
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="text-primary" />
                            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                        </div>
                        <div className="space-y-4">
                            {recentOrders.length === 0 ? (
                                <p className="text-slate-500 text-sm">No recent activity.</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <div className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500' :
                                            order.status === 'PENDING' ? 'bg-yellow-500' : 'bg-slate-500'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="text-sm text-white">Order #{order.id} - {order.status}</p>
                                            <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {order.items ? order.items.length : 0} items
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-h-[300px] bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/10">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="p-4 rounded-full bg-indigo-500/10 animate-pulse">
                            <Store size={48} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Manage Stores</h3>
                        <p className="text-slate-400 max-w-sm">Add or update store locations to expand your business reach.</p>
                        <Link to="/stores" className="text-primary hover:text-white transition-colors">Go to Stores &rarr;</Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
