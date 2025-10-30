"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    department: "Engineering",
    joinDate: "January 15, 2023",
    bio: "Passionate about web development and continuous learning.",
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
        </div>
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="gap-2">
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="p-8">
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="h-12 w-12 text-primary opacity-50" />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="text-2xl font-bold"
                />
                <Input
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  placeholder="Add a bio..."
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground mt-2">{profile.bio}</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24.5</p>
              <p className="text-xs text-muted-foreground">Learning Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="mt-6">
          <Card className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.phone}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                {isEditing ? (
                  <Input
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.location}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Department
                </label>
                {isEditing ? (
                  <Input
                    value={editedProfile.department}
                    onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.department}</p>
                )}
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Date
                </label>
                <p className="text-muted-foreground">{profile.joinDate}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-6">Your Achievements & Badges</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Quick Learner", description: "Completed 3 courses in 30 days", icon: "⚡" },
                { title: "Consistent", description: "7-day learning streak", icon: "🔥" },
                { title: "Top Performer", description: "Scored 90%+ on all quizzes", icon: "🏆" },
                { title: "Knowledge Seeker", description: "Completed 5 courses", icon: "📚" },
                { title: "Night Owl", description: "Logged in after 8 PM", icon: "🌙" },
                { title: "Early Bird", description: "Logged in before 6 AM", icon: "🌅" },
              ].map((badge, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg text-center space-y-2">
                  <div className="text-4xl">{badge.icon}</div>
                  <h4 className="font-semibold">{badge.title}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about new courses</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Course Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded about pending courses</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Achievement Notifications</p>
                  <p className="text-sm text-muted-foreground">Celebrate your milestones</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Weekly Summary</p>
                  <p className="text-sm text-muted-foreground">Get a summary of your progress</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="destructive">Leave company</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
