import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

function FarmStoryModal({ isOpen, onClose, farmer }) {
  if (!isOpen || !farmer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-card max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-gray-900">Farm Story</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="touch-target"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Farmer Profile Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={farmer.profileImage}
                alt={farmer.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=2E7D32&color=ffffff&size=128`;
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">{farmer.name}</h3>
              <p className="text-gray-600 font-body mb-3">{farmer.title}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {farmer.certifications?.map((cert, index) => (
                  <Badge key={index} variant="success" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="MapPin" size={16} className="mr-2 text-primary" />
                  {farmer.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Calendar" size={16} className="mr-2 text-primary" />
                  {farmer.experience} years farming
                </div>
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Users" size={16} className="mr-2 text-primary" />
                  {farmer.farmSize} acres
                </div>
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Leaf" size={16} className="mr-2 text-primary" />
                  {farmer.farmingMethod}
                </div>
              </div>
            </div>
          </div>

          {/* Farm Story */}
          <Card className="p-6">
            <h4 className="text-lg font-display font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="BookOpen" size={20} className="mr-2 text-primary" />
              Our Farm Story
            </h4>
            <p className="text-gray-700 font-body leading-relaxed whitespace-pre-line">
              {farmer.story}
            </p>
          </Card>

          {/* Location Map */}
          <Card className="p-6">
            <h4 className="text-lg font-display font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Map" size={20} className="mr-2 text-primary" />
              Farm Location
            </h4>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <ApperIcon name="MapPin" size={48} className="text-primary mx-auto mb-2" />
                <p className="text-gray-600 font-body">
                  {farmer.location}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Interactive map coming soon
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Distance from city center: {farmer.distance}</span>
              <span>Delivery time: {farmer.deliveryTime}</span>
            </div>
          </Card>

          {/* Farm Gallery */}
          {farmer.farmImages && farmer.farmImages.length > 0 && (
            <Card className="p-6">
              <h4 className="text-lg font-display font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Camera" size={20} className="mr-2 text-primary" />
                Farm Gallery
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {farmer.farmImages.map((image, index) => (
                  <div key={index} className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300/e5e7eb/9ca3af?text=Farm+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Farming Practices */}
          <Card className="p-6">
            <h4 className="text-lg font-display font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Sprout" size={20} className="mr-2 text-primary" />
              Farming Practices
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmer.practices?.map((practice, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <span className="text-gray-700 font-body">{practice}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Information */}
<Card className="p-6 bg-green-50 border-green-200">
            <h4 className="text-lg font-display font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Phone" size={20} className="mr-2 text-primary" />
              Get in Touch
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmer.phone && (
                <div className="flex items-center text-gray-700">
                  <ApperIcon name="Phone" size={16} className="mr-2 text-primary" />
                  <a href={`tel:${farmer.phone}`} className="hover:text-primary transition-colors">
                    {farmer.phone}
                  </a>
                </div>
              )}
              {farmer.email && (
                <div className="flex items-center text-gray-700">
                  <ApperIcon name="Mail" size={16} className="mr-2 text-primary" />
                  <a href={`mailto:${farmer.email}`} className="hover:text-primary transition-colors">
                    {farmer.email}
                  </a>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-4 font-body">
              Feel free to reach out with any questions about our farming practices or products!
            </p>
          </Card>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={onClose}
            className="w-full"
            variant="primary"
          >
            Close Farm Story
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FarmStoryModal;