
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Profile {
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  location: string | null;
  date_of_birth: string | null;
  created_at: string | null;
}

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile information"
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile?.full_name,
          email: profile?.email,
          phone_number: profile?.phone_number,
          location: profile?.location,
          date_of_birth: profile?.date_of_birth,
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original data
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Information</h1>
          <p className="text-muted-foreground">View and manage your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Details</CardTitle>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile.full_name || 'Add your name'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {profile.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input 
                  value={profile.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input 
                  value={profile.phone_number || ''} 
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Location
                </Label>
                <Input 
                  value={profile.location || ''} 
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Date of Birth
                </Label>
                <Input 
                  type="date"
                  value={profile.date_of_birth || ''} 
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInfo;
