import { formatDate } from '@fullcalendar/core/index.js';
import { Info, Package, Tag, Eye, Calendar } from 'lucide-react';
import IconBadge from '../ui/IconBadge';

/**
 * Product Specifications Section
 */
export default function ProductSpecifications({ product }) {
    const specifications = [
        {
            icon: Tag,
            label: 'Brand',
            value: product.brands,
            show: !!product.brands
        },
        {
            icon: Package,
            label: 'Category',
            value: product.category?.title,
            show: !!product.category
        },
        {
            icon: Package,
            label: 'Subcategory',
            value: product.subcategory?.title,
            show: !!product.subcategory
        },
        {
            icon: Info,
            label: 'Pack Size',
            value: product.pack_size,
            show: !!product.pack_size
        },
        {
            icon: Info,
            label: 'Status',
            value: product.status?.replace('_', ' '),
            show: !!product.status,
            capitalize: true
        },
    ].filter(spec => spec.show);

    return (
        <section className="bg-white rounded-2xl shadow p-5 lg:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <IconBadge size='lg' color='green' icon={<Info className="w-5 h-5 text-green-600" />} />
                <h2 className="text-2xl font-bold text-gray-900">Product Specifications</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {specifications.map((spec, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                        <IconBadge size='lg' color='white' icon={<spec.icon />} />

                        <div className="min-w-0">
                            <dt className="font-normal text-gray-600 text-sm">
                                {spec.label}
                            </dt>
                            <dd className={`text-gray-900 text-sm font-semibold ${spec.capitalize ? 'capitalize' : ''}`}>
                                {spec.value}
                            </dd>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ingredients/Components Section */}
            {product.ingredients && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        Ingredients/Components
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {product.ingredients}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}