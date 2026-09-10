import { PhoneCall } from "lucide-react";
import {
  emergencyContactGroups,
  localSupportContacts,
  roomContacts,
} from "@/lib/emergencyContacts";

const toTel = (phone: string) => phone.replace(/[^\d+]/g, "");

function PhoneLink({ phone }: { phone: string }) {
  if (phone === "ไม่ระบุ") {
    return <span className="text-white/35">ไม่ระบุ</span>;
  }

  return (
    <a
      href={`tel:${toTel(phone)}`}
      className="inline-flex items-center gap-1.5 text-[#ffb347] underline-offset-2 hover:underline"
    >
      <PhoneCall aria-hidden="true" size={14} />
      {phone}
    </a>
  );
}

export function EmergencyContacts() {
  return (
    <section id="emergency-contacts" className="animate-rise rounded-2xl border border-[#ff7a18]/35 bg-[#111] p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff7a18]">Emergency</p>
          <h2 className="mt-1 text-lg font-bold sm:text-xl">Emergency Contacts</h2>
        </div>
        <PhoneCall aria-hidden="true" className="text-[#ff7a18]" size={22} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {emergencyContactGroups.map((group) => (
          <div key={group.title} className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <h3 className="border-b border-white/10 px-3 py-2.5 text-sm font-semibold text-[#ffb347]">{group.title}</h3>
            <div className="divide-y divide-white/10">
              {group.contacts.map((contact) => (
                <div key={`${group.title}-${contact.name}-${contact.role || "contact"}`} className="grid gap-1 px-3 py-2.5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{contact.name}</p>
                    {contact.role && <p className="text-xs text-white/55">{contact.role}</p>}
                  </div>
                  {contact.phone && <PhoneLink phone={contact.phone} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <h3 className="border-b border-white/10 px-3 py-2.5 text-sm font-semibold text-[#ffb347]">ห้องติดต่อภายใน</h3>
          <div className="divide-y divide-white/10">
            {roomContacts.map((contact) => (
              <div key={contact.name} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                <span>{contact.name}</span>
                <PhoneLink phone={contact.phone || ""} />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <h3 className="border-b border-white/10 px-3 py-2.5 text-sm font-semibold text-[#ffb347]">หน่วยงานสนับสนุนและสถานที่ราชการ</h3>
          <div className="divide-y divide-white/10">
            {localSupportContacts.map((contact) => {
              const phone = contact.mobile || contact.workPhone || "";
              return (
                <div key={contact.name} className="grid gap-1 px-3 py-2.5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-3">
                  <p className="text-sm">{contact.name}</p>
                  <PhoneLink phone={phone} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}