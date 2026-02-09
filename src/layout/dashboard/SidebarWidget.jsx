import React from "react";
import { Sprout, Mail, Phone } from "lucide-react";

export default function SidebarWidget() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 border border-green-200 dark:border-green-800/30 shadow-sm">
      {/* Title */}
      <h3 className="text-sm font-semibold text-green-700 dark:text-white text-center">
        SuperoAgrobase
      </h3>

      {/* Tagline */}
      <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-4 leading-relaxed">
        Key to Agricultural Productivity
      </p>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-green-300 dark:via-green-700 to-transparent mb-3" />

      {/* Contact Information */}
      <div className="space-y-2">
        <a
          href="mailto:contact@superoagrobase.com"
          className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
        >
          <Mail className="w-3.5 h-3.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate">contact@superoagrobase.com</span>
        </a>
        <a
          href="tel:+2348157037737"
          className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
        >
          <Phone className="w-3.5 h-3.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span>0815 703 7737</span>
        </a>
      </div>
    </div>
  );
}