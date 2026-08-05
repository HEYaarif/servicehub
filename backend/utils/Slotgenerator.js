const BookingSlot = require("../models/bookingSlot.model");
function generateCandidateSlots(service, offering, startDate, endDate) {
  const slots = [];
  const now = new Date();

  const exceptionsByDate = new Map(
    service.dateExceptions.map((exc) => [
      exc.date.toISOString().slice(0, 10),
      exc,
    ]),
  );

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    const dateKey = d.toISOString().slice(0, 10);
    const exception = exceptionsByDate.get(dateKey);

    let windows = [];
    if (exception) {
      if (!exception.isClosed) {
        windows = [
          {
            startMin: exception.startMin,
            endMin: exception.endMin,
            capacity: exception.capacity,
          },
        ];
      }
    } else {
      const weekday = d.getUTCDay();
      windows = service.availabilityRules
        .filter((r) => r.weekday === weekday)
        .map((r) => ({
          startMin: r.startMin,
          endMin: r.endMin,
          capacity: r.capacity,
        }));
    }

    for (const window of windows) {
      for (
        let min = window.startMin;
        min + offering.durationMinutes <= window.endMin;
        min += offering.durationMinutes
      ) {
        const startAt = new Date(d);
        startAt.setUTCHours(0, min, 0, 0);
        const endAt = new Date(
          startAt.getTime() + offering.durationMinutes * 60000,
        );

        if (startAt <= now) continue;

        slots.push({ startAt, endAt, capacity: window.capacity });
      }
    }
  }

  return slots;
}

async function withRemainingCapacity(serviceId, offeringId, candidateSlots) {
  const startAts = candidateSlots.map((s) => s.startAt);
  const existing = await BookingSlot.find({
    offeringId,
    startAt: { $in: startAts },
  });
  const existingByTime = new Map(
    existing.map((s) => [s.startAt.toISOString(), s]),
  );

  return candidateSlots.map((slot) => {
    const match = existingByTime.get(slot.startAt.toISOString());
    const bookedCount = match ? match.bookedCount : 0;
    return {
      ...slot,
      slotId: match?._id || null,
      remaining: slot.capacity - bookedCount,
    };
  });
}

module.exports = { generateCandidateSlots, withRemainingCapacity };
