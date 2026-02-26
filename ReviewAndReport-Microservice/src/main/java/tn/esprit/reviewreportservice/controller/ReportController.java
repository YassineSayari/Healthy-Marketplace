package tn.esprit.reviewreportservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.reviewreportservice.entity.Report;
import tn.esprit.reviewreportservice.entity.ReportStatus;
import tn.esprit.reviewreportservice.service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public Report reportContent(@RequestBody Report report) {
        return reportService.reportContent(report);
    }

    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @PatchMapping("/{id}/status")
    public Report updateReportStatus(@PathVariable Long id, @RequestParam ReportStatus status) {
        return reportService.updateReportStatus(id, status);
    }
}
