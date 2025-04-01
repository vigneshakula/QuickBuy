import OrderItem from "../OrderItem"

const OrderListView = (props) => {
    const {orders} = props
    return (
        <ul className="cart-list">
          {orders.map(order => (
            <OrderItem key={order.orderid} order={order}  />
          ))}
        </ul>
      )
}

export default OrderListView