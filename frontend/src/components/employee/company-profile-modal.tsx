"use client"

import { motion } from "framer-motion"
import { Building2, Mail, Phone, Globe, Linkedin, Twitter, Instagram, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ICompany {
  _id?: string
  name: string
  email?: string
  profilePicture?: string
  about?: string
  phone?: string
  website?: string
  location?: string
  companyCode?: string
  social_links?: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  employees?: unknown[]
}

interface CompanyProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: ICompany | null
  isLoading: boolean
}

export function CompanyProfileModal({ open, onOpenChange, company, isLoading }: CompanyProfileModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/30 rounded-lg border border-primary/50">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <AlertDialogTitle className="text-3xl">{company?.name || "Company Profile"}</AlertDialogTitle>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/50">Official</Badge>
            </div>
            <AlertDialogDescription className="text-base text-muted-foreground">
              Organization Information & Details
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : company ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-6"
            >
              {/* Profile Picture */}
              {company.profilePicture && (
                <div className="flex justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Avatar className="w-32 h-32 border-2 border-primary/50 ring-4 ring-primary/20">
                      <AvatarImage src={company.profilePicture || "/placeholder.svg"} alt={company.name} />
                      <AvatarFallback className="bg-primary/30 text-primary text-2xl">
                        {company.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
              )}

              {/* About */}
              {company.about && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground leading-relaxed">{company.about}</p>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {company.companyCode && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Company Code</p>
                    <p className="text-sm font-mono font-semibold text-accent">{company.companyCode}</p>
                  </div>
                )}

                {company.email && (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Email</p>
                      <p className="text-sm text-foreground truncate">{company.email}</p>
                    </div>
                  </div>
                )}

                {company.phone && (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Phone</p>
                      <p className="text-sm text-foreground truncate">{company.phone}</p>
                    </div>
                  </div>
                )}

                {company.website && (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Website</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate"
                      >
                        Visit
                      </a>
                    </div>
                  </div>
                )}

                {company.location && (
                  <div className="p-3 bg-muted/50 rounded-lg sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="text-sm text-foreground">{company.location}</p>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {company.social_links && Object.values(company.social_links).some((link) => link) && (
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-medium">Connect:</p>
                  {company.social_links.linkedin && (
                    <a
                      href={company.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-primary/20 rounded-lg transition-colors duration-200"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-primary" />
                    </a>
                  )}
                  {company.social_links.twitter && (
                    <a
                      href={company.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-primary/20 rounded-lg transition-colors duration-200"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4 text-primary" />
                    </a>
                  )}
                  {company.social_links.instagram && (
                    <a
                      href={company.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-primary/20 rounded-lg transition-colors duration-200"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4 text-primary" />
                    </a>
                  )}
                </div>
              )}

              {/* Employee Count */}
              {company.employees && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/30 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Team Size</p>
                  <p className="text-2xl font-bold text-accent">{company.employees.length}</p>
                </div>
              )}
            </motion.div>
          ) : null}

          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/50 hover:bg-muted/50"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
