import IconBadge from '../ui/IconBadge';

const CheckoutFormSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-2xl border shadow p-5">
        <div className="flex items-center gap-3 mb-5">
            <IconBadge size='md' color='green' icon={<Icon className="w-6 h-6 text-green-600" />} />
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        </div>
        {children}
    </div>
);

export default CheckoutFormSection