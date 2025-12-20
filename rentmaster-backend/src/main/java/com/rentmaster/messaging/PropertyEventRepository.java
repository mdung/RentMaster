package com.rentmaster.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PropertyEventRepository extends JpaRepository<PropertyEvent, Long> {
    
    // Find events by property
    List<PropertyEvent> findByPropertyIdOrderByStartDateTimeAsc(Long propertyId);
    
    // Find events by status
    List<PropertyEvent> findByStatusOrderByStartDateTimeAsc(String status);
    
    // Find events by type
    List<PropertyEvent> findByTypeOrderByStartDateTimeAsc(String type);
    
    // Find events by organizer
    List<PropertyEvent> findByOrganizerIdOrderByStartDateTimeAsc(Long organizerId);
    
    // Find upcoming events
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "e.startDateTime > :now AND e.status IN ('SCHEDULED', 'ONGOING') " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findUpcomingEvents(@Param("now") LocalDateTime now);
    
    // Find events for specific property in date range
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "e.propertyId = :propertyId AND " +
           "e.startDateTime BETWEEN :startDate AND :endDate " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findEventsByPropertyAndDateRange(@Param("propertyId") Long propertyId,
                                                        @Param("startDate") LocalDateTime startDate,
                                                        @Param("endDate") LocalDateTime endDate);
    
    // Find events in date range
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "e.startDateTime BETWEEN :startDate AND :endDate " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findEventsByDateRange(@Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);
    
    // Find events user is attending
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           ":userId MEMBER OF e.attendeeIds " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findEventsUserAttending(@Param("userId") Long userId);
    
    // Find events user is invited to
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           ":userId MEMBER OF e.invitedIds " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findEventsUserInvitedTo(@Param("userId") Long userId);
    
    // Find public events
    List<PropertyEvent> findByIsPublicTrueOrderByStartDateTimeAsc();
    
    // Find events requiring RSVP
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "e.requiresRSVP = true AND e.rsvpDeadline > :now AND " +
           "e.status = 'SCHEDULED' ORDER BY e.rsvpDeadline ASC")
    List<PropertyEvent> findEventsRequiringRSVP(@Param("now") LocalDateTime now);
    
    // Find events with available spots
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "e.maxAttendees IS NULL OR e.currentAttendees < e.maxAttendees " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findEventsWithAvailableSpots();
    
    // Find events by priority
    List<PropertyEvent> findByPriorityOrderByStartDateTimeAsc(String priority);
    
    // Find events by category
    List<PropertyEvent> findByCategoryOrderByStartDateTimeAsc(String category);
    
    // Search events
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> searchEvents(@Param("searchTerm") String searchTerm);
    
    // Find events by tag
    @Query("SELECT e FROM PropertyEvent e JOIN e.tags t WHERE " +
           "t = :tag ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findByTag(@Param("tag") String tag);
    
    // Find events needing reminders
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "e.sendReminders = true AND e.status = 'SCHEDULED' AND " +
           "e.startDateTime BETWEEN :now AND :reminderTime")
    List<PropertyEvent> findEventsNeedingReminders(@Param("now") LocalDateTime now,
                                                  @Param("reminderTime") LocalDateTime reminderTime);
    
    // Get event statistics
    @Query("SELECT e.type, COUNT(e) FROM PropertyEvent e GROUP BY e.type")
    List<Object[]> getEventStatsByType();
    
    @Query("SELECT e.status, COUNT(e) FROM PropertyEvent e GROUP BY e.status")
    List<Object[]> getEventStatsByStatus();
    
    @Query("SELECT e.category, COUNT(e) FROM PropertyEvent e GROUP BY e.category")
    List<Object[]> getEventStatsByCategory();
    
    // Find events for calendar view (month)
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "YEAR(e.startDateTime) = :year AND MONTH(e.startDateTime) = :month " +
           "ORDER BY e.startDateTime ASC")
    List<PropertyEvent> findEventsForMonth(@Param("year") int year, @Param("month") int month);
    
    // Find conflicting events (same property, overlapping time)
    @Query("SELECT e FROM PropertyEvent e WHERE " +
           "e.propertyId = :propertyId AND e.id != :eventId AND " +
           "((e.startDateTime BETWEEN :startTime AND :endTime) OR " +
           "(e.endDateTime BETWEEN :startTime AND :endTime) OR " +
           "(e.startDateTime <= :startTime AND e.endDateTime >= :endTime))")
    List<PropertyEvent> findConflictingEvents(@Param("propertyId") Long propertyId,
                                            @Param("eventId") Long eventId,
                                            @Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime);
}