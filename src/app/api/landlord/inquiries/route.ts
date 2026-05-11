import { getCurrentUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { listingStore } from "@/lib/data";
import { conversationStore, messageStore } from "@/lib/stores";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "landlord" && user.role !== "admin")) {
    return apiError("Unauthorized", { status: 401 });
  }

  const [allListings, allConversations, messages] = await Promise.all([
    listingStore.findAll(),
    conversationStore.findAll(),
    messageStore.findAll(),
  ]);
  const listings = allListings.filter(
    (listing) => user.role === "admin" || listing.landlord.email === user.email,
  );
  const listingMap = new Map(listings.map((listing) => [listing.id, listing]));
  const conversations = allConversations.filter((conversation) => listingMap.has(conversation.listingId));

  const data = conversations.map((conversation) => {
    const conversationMessages = messages
      .filter((message) => message.conversationId === conversation.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const listing = listingMap.get(conversation.listingId);
    const studentName = conversation.participantNames.find((name) => name !== listing?.landlord.name) || "Studente";
    const landlordMessage = conversationMessages.find((message) => message.senderId === user.id);

    return {
      id: conversation.id,
      studentName,
      listingTitle: conversation.listingTitle,
      status: landlordMessage ? "responded" : "new",
      receivedAt: conversationMessages[0]?.createdAt || conversation.lastMessageAt,
      respondedAt: landlordMessage?.createdAt || null,
    };
  });

  return apiSuccess(data, { meta: { actorRole: user.role } });
}
