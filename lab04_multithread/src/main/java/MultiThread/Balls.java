/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package MultiThread;

import java.awt.*;
import javax.swing.*;

public class Balls extends Thread {
    private JPanel box;
    private static final int XSIZE = 10;
    private static final int YSIZE = 10;
    private int x = 0;
    private int y = 0;
    private int dx = 2;
    private int dy = 2;

    public Balls(JPanel p) {
        box = p;
    }

    public void draw() {
        Graphics g = box.getGraphics();
        g.fillOval(x, y, XSIZE, YSIZE);
        g.dispose();
    }

    public void move() {
        // xoa hinh cu bang cach ve de len
        Graphics g = box.getGraphics();
        g.setXORMode(Color.GREEN);
        g.fillOval(x, y, XSIZE, YSIZE);
        
        x += dx;
        y += dy;
        
        Dimension d = box.getSize();
        
        // kiemtra cos dung cac canh
        if (x < 0) {
            x = 0;
            dx = -dx;
        }
        
        if (x + XSIZE >= d.getWidth()) {
            x = (int) d.getWidth() - XSIZE;
            dx = -dx;
        }
        
        if (y < 0) {
            y = 0;
            dy = -dy;
        }
        
        if (y + YSIZE >= d.getHeight()) {
            y = (int) d.getHeight() - YSIZE;
            dy = -dy;
        }
        
        g.fillOval(x, y, dx, XSIZE); // Luu y: Anh goc ghi 'dx' o day, co the la loi danh may cua file mau, dung ra nen la XSIZE
        g.dispose();
    }

    @Override
    public void run() {
        draw();
        for (int i = 0; i < 5000; i++) {
            move();
            try {
                sleep(1);
            } catch (InterruptedException ex) {
                JOptionPane.showMessageDialog(null, ex.toString(), "Thong bao loi", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}