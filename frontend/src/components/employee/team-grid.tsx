"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface TeamMember {
  _id: string
  name: string
  email: string
  photo?: string
  position?: string
}

interface TeamGridProps {
  members: TeamMember[]
}

export function TeamGrid({ members }: TeamGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Team Members</h2>
        <span className="ml-auto text-sm font-medium text-muted-foreground">{members.length} members</span>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {members.map((member) => (
          <motion.div key={member._id} variants={itemVariants} className="group">
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 backdrop-blur-sm h-full cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3 h-full justify-center">
                <Avatar className="w-20 h-20 border-2 border-primary/30 ring-2 ring-primary/10 group-hover:ring-primary/30 group-hover:border-primary/50 transition-all duration-300">
                  <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {member.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate text-base">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  {member.position && <p className="text-xs text-primary/70 mt-1 font-medium">{member.position}</p>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
